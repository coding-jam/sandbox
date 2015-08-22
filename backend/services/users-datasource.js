var _ = require("underscore");
var fs = require('fs');
var Q = require('q');

var usersDs = {

    data: {
        folder: __dirname + '/../data/',
        usersFolder: '_users'
    },

    getUsers: function () {
        return users;
    },

    findBy: function (locations) {
        return usersDs.getUsers('it')
            .then(function (users) {
                return _.filter(users.items, function (user) {
                    return _.contains(locations, user.location.toLowerCase());
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

var users = loadUsers('it');

function loadUsers(country) {
    var users = {
        total_count: 0,
        items: []
    };

    var deferred = Q.defer();
    fs.readdir(usersDs.data.folder + country + usersDs.data.usersFolder, function (err, files) {
        if (err || files.length == 0) {
            deferred.reject(err || 'No data!');
        } else {
            var promises = [];
            files.forEach(function (file) {
                if (file.match('\.json$')) {
                    var deferredLoop = Q.defer();
                    var filePath = usersDs.data.folder + country + usersDs.data.usersFolder + '/' + file;
                    fs.readFile(filePath, 'utf8', function (err, data) {
                        if (err) {
                            deferredLoop.reject(err);
                        }
                        var json = JSON.parse(data);
                        users.total_count += json.total_count;
                        users.items = users.items.concat(json.items);
                        deferredLoop.resolve();
                    });
                    promises.push(deferredLoop.promise);
                }
            });
            Q.all(promises)
                .then(function () {
                    deferred.resolve(users);
                })
                .catch(function (err) {
                    deferred.reject(err);
                });
        }
    });
    return deferred.promise;
}

module.exports = usersDs;