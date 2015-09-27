var _ = require("underscore");
var Q = require('q');
var db = require('./../../dao/mongodb/mongo-connection');
var locationsDs = require('./../../dao/mongodb/locations-datasource');
var countryMappings = require("./../../country-mappings");
require('./../../utils');

function createGroupByLanguageModel() {
    return [
        { $unwind : "$languages" },
        { $group : { _id : "$languages", usersPerLanguage : { $sum : 1 } } },
        { $sort : { usersPerLanguage : -1, _id: 1 } }
    ];
}

var languagesAdapter = {

    getRankedLanguages: function (country, district, dbRef) {

        var findModel = createGroupByLanguageModel();
        if (district) {
            findModel.unshift({ $match : {'gitmap.geolocation.address_components': {$elemMatch: {short_name: new RegExp('^' + district + '$', 'i')}}}});
        }

        if (dbRef) {
            return Q.when(executeQuery(dbRef, country, findModel));
        } else {
            return Q.when(db().then(function (db) {
                return executeQuery(db, country, findModel)
                    .then(function (ranked) {
                        db.close();
                        return ranked;
                    })
            }));
        }

        function executeQuery(db, country, findModel) {
            return db.collection(country + '_users')
                .aggregate(findModel)
                .toArray()
                .then(function (result) {
                    var ranked = _.map(result, function (res) {
                        res.language = res._id;
                        delete res._id;
                        return res;
                    });
                    return ranked;
                })
        }
    },

    getLanguagesPerDistrict: function (country) {
        return Q.when(db().then(function (db) {
            return locationsDs.getDistricts(country, db)
                .then(function (districts) {
                    return Q.each(districts, function (deferred, district) {
                        languagesAdapter.getRankedLanguages(country, district.district.toLowerCase(), db)
                            .then(function (languages) {
                                deferred.resolve({
                                    districtName: district.district,
                                    languages: languages
                                });
                            })
                    })
                    .then(function(languagesPerDistricts) {
                        return {
                            languagesPerDistricts: languagesPerDistricts
                        }
                    });
                })
                .then(function (languagesPerDistricts) {
                    db.close();
                    return languagesPerDistricts;
                })
        }));
    },

    getLanguagesPerCountry: function () {
        //var result = {
        //    languagesPerCountries: []
        //};
        //
        //var promises = [];
        //_.keys(countryMappings.language).forEach(function(country) {
        //    var deferredLoop = Q.defer();
        //    languagesAdapter.getRankedLanguages(country)
        //        .then(function(languages) {
        //            result.languagesPerCountries.push({
        //                countryName: countryMappings.location[country].capitalize(),
        //                countryKey: country,
        //                languages: languages
        //            });
        //            deferredLoop.resolve();
        //        })
        //        .catch(deferredLoop.resolve); //FIXME quando ci sono tutti i paesi
        //    promises.push(deferredLoop.promise);
        //});
        //return Q.all(promises)
        //    .then(function() {
        //        return result;
        //    });
    }
}

module.exports = languagesAdapter;