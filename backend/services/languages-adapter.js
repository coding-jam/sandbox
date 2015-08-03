var _ = require("underscore");
var Q = require('q');
var userDs = require(__dirname + "/users-datasource");
var locationDs = require(__dirname + "/locations-datasource");


function sortByValue(obj, desc) {
    var sortable = [];
    for (var key in obj) {
        sortable.push([key, obj[key]])
    }
    sortable.sort(function (a, b) {
        return desc ? b[1] - a[1] : a[1] - b[1]
    })
    return sortable;
}

function findLanguages(users) {
    var languages = _.chain(users.items)
        .map('languages')
        .flatten()
        .countBy(function (lang) {
            return lang;
        })
        .value();
    return sortByValue(languages, true);
}

function adaptLanguages(languages) {
    return _.map(languages, function (language) {
        return {
            language: language[0],
            usersPerLanguage: language[1]
        }
    });
}

var languagesAdapter = {

    getRankedLanguages: function (regione) {

        if (regione) {
            return locationDs.findRegioneBy(regione)
                .then(function (locations) {
                    return userDs.findBy(_.keys(locations));
                })
                .then(findLanguages)
                .then(adaptLanguages)
        } else {
            return userDs.getUsers()
                .then(findLanguages)
                .then(adaptLanguages);
        }
    },

    getLanguagesPerLocations: function () {
        return locationDs.getRegioni()
            .then(function (regioni) {
                var promises = [];
                regioni.forEach(function(regione) {
                    var deferredLoop = Q.defer();
                    languagesAdapter.getRankedLanguages(regione.toLowerCase())
                        .then(function(languages) {
                            deferredLoop.resolve({
                                regionName: regione,
                                languages: languages
                            });
                        })
                        .catch(function(err) {
                            deferredLoop.reject(err);
                        });
                    promises.push(deferredLoop.promise);
                });
                return Q.all(promises);
            })
            .then(function(languagesPerRegions) {
                return {
                    languagesPerRegions: languagesPerRegions
                }
            });
    }
}

module.exports = languagesAdapter;