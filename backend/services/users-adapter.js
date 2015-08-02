var _ = require("underscore");
var userDs = require(__dirname + "/users-datasource");
var locationDs = require(__dirname + "/locations-datasource");

var userAdapter = {

    getByRegione: function (regione) {
        var locationsFound;
        return locationDs.findBy('administrative_area_level_1', regione)
            .then(function (locations) {
                locationsFound = locations;
                return userDs.findBy(_.keys(locations));
            })
            .then(function (users) {
                return _.map(users, function (user) {
                    user.geolocation = locationsFound[user.location];
                    return user;
                });
            });
    }

};

module.exports = userAdapter;