var _ = require("underscore");
var Q = require('q');
var db = require('./mongo-connection');

var locationsDs = {

    /**
     * Return all districts of a country
     *
     * @param country it, uk
     * @returns {Promise}
     */
    getDistricts: function (country) {
        return db().then(function (db) {
            return db.collection(country + '_districts')
                .find({}, {district: 1, _id: 0})
                .toArray()
                .then(function (result) {
                    db.close();
                    return result;
                });
        });
    }

}

module.exports = locationsDs;