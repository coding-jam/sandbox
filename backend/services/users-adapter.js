var _ = require("underscore");
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
    }

};

module.exports = userAdapter;