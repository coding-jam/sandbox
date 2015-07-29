var ghHttp = require('./gh-http');
var geolocator = require('./geolocator');
var Q = require('q');
var fs = require('fs');
var _ = require("underscore");

var collector = {

    data: {
        folder: __dirname + '/data/',
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
            collector.options.rangeTemplate.forEach(function (el, i) {
                allPromises.push(executeRequest(i));
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

        function executeRequest(i) {
            var url = collector.options.resourceTemplate.replace(/\{secret\}/g, collector.options.secrets);
            return ghHttp.getWithLimit(createRange(url, year, i), true)
                .then(function (resp) {
                    return resp.body;
                }, function (err) {
                    console.error(err);
                });

            function createRange(resource, year, i) {
                var range = collector.options.rangeTemplate[i].replace(/\{year\}/g, year);
                console.log('Query range ' + range);
                return resource.replace('{range}', range);
            }
        }

        function saveUsers(data, deferred) {
            var result = {
                total_count: 0,
                items: []
            };

            data.forEach(function (jsonObj, i) {
                if (jsonObj.total_count != undefined) {
                    result.total_count = result.total_count + jsonObj.total_count;
                    result.items = result.items.concat(jsonObj.items);
                } else {
                    console.error('Found json: ' + jsonObj)
                }
            });
            fs.writeFile(collector.data.folder + collector.data.users, JSON.stringify(result), function (err) {
                if (err) {
                    console.error(err);
                }

                console.log(collector.data.users + ' saved');
                deferred.resolve(result);
            });
            console.log('Total users found ' + result.total_count);
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
                //if (user.url == 'https://api.github.com/users/mcollina') {
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
                            throw err;
                        });
                    promises.push(deferredLoop.promise);
                //}
            });

            Q.all(promises).then(function() {
                fs.writeFile(collector.data.folder + collector.data.users, JSON.stringify(users), function (err) {
                    if (err) {
                        console.error(err);
                    }

                    console.log(collector.data.users + ' updated');
                    deferred.resolve();
                });
            });

            function addRepoDetails(user) {
                var promises = [];
                for (var i = 1; i <= (Math.floor(user.public_repos / 100) + 1); i++) {
                    (function() {
                        var pagedDeferred = Q.defer();
                        ghHttp.getWithLimit(user.repos_url + '?' + collector.options.secrets + '&per_page=100&page=' + i, false)
                            .then(function (resp) {
                                var languages = _.pluck(resp.body, 'language');
                                pagedDeferred.resolve(languages);
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
                        cacheLocations(users, deferred);
                    }, function(err) {
                        deferred.reject(err);
                    });
            } else {
                fs.readFile(collector.data.folder + collector.data.users, 'utf8', function (err, data) {
                    if (err) {
                        deferred.reject(err);
                    }
                    var users = JSON.parse(data);
                    cacheLocations(users, deferred);
                });
            }
        });

        return deferred.promise;

        function cacheLocations(users, deferred) {
            var distinctLocations = _.chain(users.items).map(function(item) {return item.location ? item.location.toLowerCase() : item.location}).unique().value();
            var promises = [];
            var locationCache = {};
            distinctLocations.forEach(function(location) {
                if (location) {
                    var deferredLoop = Q.defer();
                    geolocator.locate(location)
                        .then(function (resp) {
                            locationCache[location] = resp.body;
                            deferredLoop.resolve(location);
                        })
                        .catch(function (err) {
                            deferredLoop.reject(err);
                        });
                    promises.push(deferredLoop.promise);
                }
            });

            Q.all(promises).then(function() {
                fs.writeFile(collector.data.folder + collector.data.locations, JSON.stringify(locationCache), function (err) {
                    if (err) {
                        console.error(err);
                    }

                    console.log(collector.data.locations + ' saved');
                    deferred.resolve(distinctLocations);
                });
            });
        }
    }
}

module.exports = collector;