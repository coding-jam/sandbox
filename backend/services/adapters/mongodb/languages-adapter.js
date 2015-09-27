var _ = require("underscore");
var Q = require('q');
var db = require('./../../dao/mongodb/mongo-connection');
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

    getRankedLanguages: function (country, district) {

        var findModel = createGroupByLanguageModel();
        if (district) {
            findModel.unshift({ $match : {'gitmap.geolocation.address_components': {$elemMatch: {short_name: new RegExp('^' + district + '$', 'i')}}}});
        }

        return Q.when(db().then(function (db) {
            return db.collection(country + '_users')
                .aggregate(findModel)
                .toArray()
                .then(function (result) {
                    var ranked = _.map(result, function (res) {
                        res.language = res._id;
                        delete res._id;
                        return res;
                    });
                    db.close();
                    return ranked;
                })
        }));
    },

    getLanguagesPerDistrict: function (country) {
        //return locationDs.getDistricts(country)
        //    .then(function (districts) {
        //        var promises = [];
        //        districts.forEach(function(district) {
        //            var deferredLoop = Q.defer();
        //            languagesAdapter.getRankedLanguages(country, district.toLowerCase())
        //                .then(function(languages) {
        //                    deferredLoop.resolve({
        //                        districtName: district,
        //                        languages: languages
        //                    });
        //                })
        //                .catch(function(err) {
        //                    deferredLoop.reject(err);
        //                });
        //            promises.push(deferredLoop.promise);
        //        });
        //        return Q.all(promises);
        //    })
        //    .then(function(languagesPerDistricts) {
        //        return {
        //            languagesPerDistricts: languagesPerDistricts
        //        }
        //    });
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