var _ = require("underscore");
var fs = require('fs');
//var usersData = require(__dirname + '/../data/it_users');

var usersDs = {

    usersData: {},

    readData: function() {
        fs.readFile(__dirname + '/../data/it_users.json', 'utf8', function (err, data) {
            if (err) {
                throw err;
            }
            usersDs.usersData = JSON.parse(data);
        });
    },

    findBy: function(locations) {
        return _.filter(usersDs.usersData.items, function(user) {
            return _.contains(locations, user.location);
        });
    }
};

usersDs.readData();

module.exports = usersDs;