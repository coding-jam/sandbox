var Q = require('q');
var db = require('./mongo-connection');

var countriesDs = {

    /**
     * Return continents and related countries
     *
     * @returns {Promise}
     */
    getCountriesLocations: function() {
        return Q.when(db().then(function (db) {
            return db.collection('countries')
                .find({})
                .toArray()
                .then(function (countries) {
                    db.close();
                    return countries;
                })
        }));
    }

};

module.exports = countriesDs;