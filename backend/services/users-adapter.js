var _ = require("underscore");
var Q = require('q');
var userDs = require(__dirname + "/users-datasource");
var locationDs = require(__dirname + "/locations-datasource");

var userAdapter = {

    /**
     * @deprecated use {@link getByDistrict}
     *
     * Return italian users in a region
     *
     * @param regione
     * @returns {Promise}
     */
    getByRegione: function (regione) {
        var locationsFound;
        return locationDs.findRegioneBy(regione)
            .then(function (locations) {
                locationsFound = locations;
                return userDs.findBy('it', _.keys(locations));
            })
            .then(function (users) {
                return _.chain(users.items)
                    .map(function (user) {
                        user.geolocation = locationsFound[user.location];
                        return user;
                    })
                    .sortBy(function(user) {
                        return user.login.toLowerCase();
                    })
                    .value();
            })
            .then(function(filtered) {
                return {
                    total_count: filtered.length,
                    items: filtered
                }
            });
    },

    /**
     * Return all user in a district of a country
     *
     * @param country
     * @param district
     * @returns {Promise}
     */
    getByDistrict: function (country, district) {
        var locationsFound;
        return locationDs.findLocationsBy(country, district)
            .then(function (locations) {
                locationsFound = locations;
                return userDs.findBy(country, _.keys(locations));
            })
            .then(function (users) {
                return _.chain(users.items)
                    .map(function (user) {
                        user.geolocation = locationsFound[user.location];
                        return user;
                    })
                    .sortBy(function(user) {
                        return user.login.toLowerCase();
                    })
                    .value();
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
            usersInLocations: []
        };
        return locationDs.getRegioni()
            .then(function(regioni) {
                var promises = [];
                regioni.forEach(function(regione) {
                    var deferredLoop = Q.defer();
                    userAdapter.getByRegione(regione.toLowerCase())
                        .then(function(users) {
                            deferredLoop.resolve({
                                districtName: regione,
                                usersDetails: baseUrl + '/' + encodeURIComponent(regione.toLowerCase()),
                                usersCount: users.total_count
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
                result.usersInLocations = usersPerRegions
                return result;
            });

    },

    getUsersPerDistrict: function(country, baseUrl) {
        var result = {
            usersInLocations: []
        };
        return locationDs.getDistricts(country)
            .then(function(districts) {
                var promises = [];
                districts.forEach(function(district) {
                    var deferredLoop = Q.defer();
                    userAdapter.getByDistrict(country, district.toLowerCase())
                        .then(function(users) {
                            deferredLoop.resolve({
                                districtName: district,
                                usersDetails: baseUrl + '/' + encodeURIComponent(district.toLowerCase()),
                                usersCount: users.total_count
                            });
                        })
                        .catch(function(err) {
                            deferredLoop.reject(err);
                        });
                    promises.push(deferredLoop.promise);
                });
                return Q.all(promises);
            })
            .then(function(usersPerDistricts) {
                result.usersInLocations = usersPerDistricts
                return result;
            });

    }

};

module.exports = userAdapter;