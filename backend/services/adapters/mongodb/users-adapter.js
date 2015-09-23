var _ = require("underscore");
var Q = require("q");
var db = require('./../../dao/mongodb/mongo-connection');
var locationDs = require('./../../dao/mongodb/locations-datasource');
require('./../../utils');

var userAdapter = {

    /**
     * Return all user in a district of a country
     *
     * @param country
     * @param district
     * @returns {Promise}
     */
    getByDistrict: function (country, district, languages) {
        var users = db().then(function (db) {
            var findModel = {
                'gitmap.geolocation.address_components': {$elemMatch: {short_name: new RegExp('^' + district + '$', 'i')}}
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

        return Q.when(users);

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

    getUsersPerDistrict: function (country, baseUrl) {
        var users = db().then(function (db) {
            return db.collection(country + '_districts')
                .find({}, {district: 1, _id: 0})
                .toArray()
                .then(function (districts) {
                    return Q.each(districts, function (deferred, district) {
                        userAdapter.getByDistrict(country, district.district)
                            .then(function (users) {
                                deferred.resolve({
                                    districtName: district.district,
                                    usersDetails: baseUrl + '/' + encodeURIComponent(district.district.toLowerCase()),
                                    usersCount: users.total_count
                                });
                            })
                            .catch(function (err) {
                                console.error(err);
                                deferred.reject(err);
                            });
                    });
                })
                .then(function (usersInLocations) {
                    db.close();
                    return {
                        usersInLocations: usersInLocations
                    }
                })
                .catch(function (err) {
                    db.close();
                    return Q.reject(err);
                })
        });

        return Q.when(users);
    }
};

module.exports = userAdapter;