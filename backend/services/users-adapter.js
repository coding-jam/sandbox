var _ = require("underscore");
var Q = require('q');
var userDs = require(__dirname + "/users-datasource");
var locationDs = require(__dirname + "/locations-datasource");

var userAdapter = {

    getByRegione: function (regione) {
        var locationsFound;
        return locationDs.findRegioneBy(regione)
            .then(function (locations) {
                locationsFound = locations;
                return userDs.findBy(_.keys(locations));
            })
            .then(function (users) {
                return _.map(users.items, function (user) {
                    user.geolocation = locationsFound[user.location];
                    return user;
                });
            })
            .then(function(filtered) {
                return {
                    total_count: filtered.length,
                    items: filtered
                }
            });
    },

    getUsersPerRegione: function(baseUrl) {
        var result = {
            locations: []
        };
        return locationDs.findRegioni()
            .then(function(regioni) {
                var promises = [];
                regioni.forEach(function(regione) {
                    var deferredLoop = Q.defer();
                    userAdapter.getByRegione(regione.toLowerCase())
                        .then(function(users) {
                            deferredLoop.resolve({
                                name: regione,
                                url: baseUrl + '/' + encodeURIComponent(regione.toLowerCase()),
                                users: users.total_count
                            });
                        })
                        .catch(function(err) {
                            deferredLoop.reject(err);
                        });
                    promises.push(deferredLoop.promise);
                });
                return Q.all(promises);
            })
            .then(function(usersPerRegions) {
                result.locations = usersPerRegions
                return result;
            });

    }

};

module.exports = userAdapter;