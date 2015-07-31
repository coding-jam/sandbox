var ghHttp = require('./gh-http');
var geolocator = require('./geolocator');
var Q = require('q');
var fs = require('fs');
var _ = require("underscore");

var collector = {

    data: {
        folder: __dirname + '/../data/',
        users: 'it_users.json',
        locations: 'it_locations.json'
    },

    options: {
        secrets: ghHttp.secrets,
        resourceTemplate: 'https://api.github.com/search/users?q=created:%22{range}%22%20location:italy%20type:user&sort=joined&per_page=100&{secret}',
        rangeTemplate: [
            '{year}-01-01%20..%20{year}-03-31',
            '{year}-04-01%20..%20{year}-06-30',
            '{year}-07-01%20..%20{year}-09-30',
            '{year}-10-01%20..%20{year}-12-31'
        ]
    },

    collectUsers: function () {

        var deferred = Q.defer();
        var year = 2008;

        var allPromises = [];
        while (year <= new Date().getFullYear()) {
            collector.options.rangeTemplate.forEach(function (rangeTemplate) {
                allPromises.push(executeRequest(rangeTemplate));
            });
            year++;
        }

        Q.all(allPromises).then(function (data) {
            saveUsers(data, deferred);
        }, function (error) {
            console.error('ERROR!! ' + error.message);
            deferred.reject(error);
        });

        return deferred.promise;

        function executeRequest(rangeTemplate) {
            var range = createRange(year, rangeTemplate);
            var url = collector.options.resourceTemplate.replace(/\{secret\}/g, collector.options.secrets).replace('{range}', range);
            return ghHttp.getWithLimit(url, true)
                .then(function (resp) {
                    console.info(resp.body.total_count + ' users found in range ' + range);
                    if (resp.body.total_count > 100) {
                        return handlePagination(resp.body, url);
                    } else {
                        return resp.body;
                    }
                });

            function createRange(year, rangeTemplate) {
                var range = rangeTemplate.replace(/\{year\}/g, year);
                console.log('Query range ' + range);
                return range;
            }

            function handlePagination(users, url) {
                var promises = [];
                for (var i = 2; i <= (Math.floor(users.total_count / 100) + 1); i++) {
                    (function() {
                        var pagedDeferred = Q.defer();
                        ghHttp.getWithLimit(url + '&page=' + i, true)
                            .then(function (resp) {
                                if (resp.body.total_count) {
                                    pagedDeferred.resolve(resp.body);
                                } else {
                                    pagedDeferred.reject(resp.body);
                                }
                            })
                            .catch(function (err) {
                                console.error(err);
                                pagedDeferred.reject(err);
                            });
                        promises.push(pagedDeferred.promise);
                    })();
                }
                return Q.all(promises).then(function(usersPages) {
                    var result = {
                        total_count: users.total_count,
                        items: users.items
                    };

                    usersPages.forEach(function(usersPage) {
                        result.items = result.items.concat(usersPage.items);
                    });
                    checkConsistency(result, 'handlePagination');
                    return result;
                }, function(err) {
                    console.error(err);
                    return err;
                });
            }
        }

        function saveUsers(data, deferred) {
            var result = {
                total_count: 0,
                items: []
            };

            data.forEach(function (jsonObj) {
                if (jsonObj.total_count != undefined) {
                    result.total_count = result.total_count + jsonObj.total_count;
                    result.items = result.items.concat(jsonObj.items);
                } else {
                    console.error('Found json: ' + JSON.stringify(jsonObj));
                }
            });
            checkConsistency(result, 'saveUsers');
            fs.writeFile(collector.data.folder + collector.data.users, JSON.stringify(result), function (err) {
                if (err) {
                    console.error(err);
                }

                console.log(collector.data.users + ' saved');
                deferred.resolve(result);
            });
            console.log('Total users found ' + result.total_count);
        }

        function checkConsistency(users, log) {
            if (users.total_count != users.items.length) {
                throw 'NOOOOOOOOO!!! Found ' + users.items.length + ' instead of ' + users.total_count + ' in ' + log;
            }
        }
    },

    collectUserDetails: function () {

        var deferred = Q.defer();
        fs.exists(collector.data.folder + collector.data.users, function (exists) {
            if (!exists) {
                collector.collectUsers()
                    .then(function (users) {
                        addDetails(users, deferred);
                    }, function(err) {
                        deferred.reject(err);
                    });
            } else {
                fs.readFile(collector.data.folder + collector.data.users, 'utf8', function (err, data) {
                    if (err) {
                        deferred.reject(err);
                    }
                    var users = JSON.parse(data);
                    addDetails(users, deferred);
                });
            }
        });

        return deferred.promise;


        function addDetails(users, deferred) {

            var promises = [];

            users.items.forEach(function(user, i) {
                var deferredLoop = Q.defer();
                ghHttp.getWithLimit(user.url + '?' + collector.options.secrets, false)
                    .then(function(resp) {
                        return _.extend(user, resp.body);
                    })
                    .then(function(user) {
                        return addRepoDetails(user);
                    })
                    .then(function(user) {
                        deferredLoop.resolve(user);
                    })
                    .catch(function(err) {
                        logger.error(err);
                        deferredLoop.reject(err);
                    });
                promises.push(deferredLoop.promise);
            });

            Q.all(promises)
                .then(function() {
                    fs.writeFile(collector.data.folder + collector.data.users, JSON.stringify(users), function (err) {
                        if (err) {
                            console.error(err);
                        }

                        console.log(collector.data.users + ' updated');
                        deferred.resolve();
                    });
                }).catch(function(err) {
                    deferred.reject(err);
                });

            function addRepoDetails(user) {
                var promises = [];
                for (var i = 1; i <= (Math.floor(user.public_repos / 100) + 1); i++) {
                    (function() {
                        var pagedDeferred = Q.defer();
                        ghHttp.getWithLimit(user.repos_url + '?' + collector.options.secrets + '&per_page=100&page=' + i, false)
                            .then(function (resp) {
                                var languages = _.pluck(resp.body, 'language');
                                if (languages) {
                                    pagedDeferred.resolve(languages);
                                } else {
                                    pagedDeferred.reject(resp.body);
                                }
                            })
                            .catch(function (err) {
                                console.error(err);
                                pagedDeferred.reject(err);
                            });
                        promises.push(pagedDeferred.promise);
                    })();
                }
                return Q.all(promises).then(function(languages) {
                    user.languages = _.chain(languages).flatten().unique().compact().value();
                    return user;
                }, function(err) {
                    console.error(err);
                    return user;
                });
            }
        }
    },

    collectLocations: function() {
        var deferred = Q.defer();
        fs.exists(collector.data.folder + collector.data.users, function (exists) {
            if (!exists) {
                collector.collectUserDetails()
                    .then(function (users) {
                        getLocations(users, deferred);
                    }, function(err) {
                        deferred.reject(err);
                    });
            } else {
                fs.readFile(collector.data.folder + collector.data.users, 'utf8', function (err, data) {
                    if (err) {
                        deferred.reject(err);
                    }
                    var users = JSON.parse(data);
                    getLocations(users, deferred);
                });
            }
        });

        return deferred.promise;

        function getLocations(users, deferred) {
            fs.exists(collector.data.folder + collector.data.locations, function (exists) {
                if (!exists) {
                    cacheLocations(users, deferred);
                } else {
                    fs.readFile(collector.data.folder + collector.data.locations, 'utf8', function (err, data) {
                        if (err) {
                            deferred.reject(err);
                        }
                        deferred.resolve(_.keys(JSON.parse(data)));
                    });
                }
            });
        };

        function cacheLocations(users, deferred) {
            var distinctLocations = _.chain(users.items).map(function(item) {return item.location ? item.location.toLowerCase() : item.location}).unique().value();
            var promises = [];
            var locationCache = {};
            distinctLocations.forEach(function(location) {
                if (location) {
                    var deferredLoop = Q.defer();
                    geolocator.locate(location)
                        .then(function (resp) {
                            locationCache[location] = resp.body.results;
                            deferredLoop.resolve(location);
                        })
                        .catch(function (err) {
                            deferredLoop.reject(err);
                        });
                    promises.push(deferredLoop.promise);
                }
            });

            Q.all(promises)
                .then(function() {
                    fs.writeFile(collector.data.folder + collector.data.locations, JSON.stringify(locationCache), function (err) {
                        if (err) {
                            console.error(err);
                            deferred.reject(err);
                        }

                        console.log(collector.data.locations + ' saved');
                        deferred.resolve(distinctLocations);
                    });
                })
                .catch(function(err) {
                    console.info('Ops! Some promises are not resolved...');
                    console.error(err);
                    deferred.reject(err);
                });
        }
    }
}

module.exports = collector;