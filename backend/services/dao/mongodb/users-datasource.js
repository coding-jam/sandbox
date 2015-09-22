var _ = require("underscore");
var db = require('./mongo-connection');

var usersDs = {

    //getUsers: function (country) {
    //    if (users[country]) {
    //        return users[country];
    //    } else {
    //        return Q.reject('Country unknown!');
    //    }
    //},

    findBy: function (country, district, languages) {
        return db().then(function (db) {
            var findModel = {
                'gitmap.geolocation.address_components': {$elemMatch: {short_name: /^molise$/i}}
            };

            if (languages) {
                findModel.languages = {$all: normalizeForQuery(languages)};
            } else {
                findModel['languages.0'] = {$exists: true};
            }

            return db.collection(country + '_users')
                .find(findModel)
                .toArray()
                .then(function (users) {
                    return {
                        total_count: users.length,
                        items: users
                    };
                })
                .then(function (users) {
                    db.close();
                    return users;
                })
        });

        function normalizeForQuery(array) {
            if (array && array.length) {
                return _.chain(array)
                    .map(function (value) {
                        return value.toLowerCase().trim();
                    })
                    .filter(function (value) {
                        return !!value;
                    })
                    .map(function (value) {
                        return new RegExp('^' + value + '$', 'i');
                    })
                    .value();
            } else {
                return array;
            }
        }
    },

    //getCreationDate: function (country) {
    //    return Q.nfcall(fs.stat, usersDs.data.folder + country + usersDs.data.usersFolder)
    //        .then(function (data) {
    //           return data.birthtime;
    //        });
    //}
};

module.exports = usersDs;