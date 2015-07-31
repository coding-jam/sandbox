var _ = require("underscore");
var fs = require('fs');
var usersData = require(__dirname + '/../data/it_users');

var usersDs = {

    findBy: function(locations) {
        return _.filter(usersData.items, function(user) {
            return _.contains(locations, user.location);
        });
    }
};

module.exports = usersDs;