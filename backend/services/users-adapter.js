var _ = require("underscore");
var userDs = require("./users-datasource");
var locationDs = require("./locations-datasource");

var userAdapter = {

    getByRegione: function(regione) {
        var locations = locationDs.findBy('administrative_area_level_1', regione);
        var users = userDs.findBy(_.keys(locations));

        return _.map(users, function(user) {
            user.geolocation = locations[user.location];
            return user;
        });
    }

};

module.exports = userAdapter;