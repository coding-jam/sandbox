var _ = require("underscore");
var Q = require('q');
var countriesData = require(__dirname + '/../data/countries');

var countriesDs = {

    getCountriesLocations: function() {
        return Q.fcall(function() {
            var result = {};
            _.keys(countriesData).forEach(function(country) {
                result[country] = {
                    name: countriesData[country].results[0].formatted_address,
                    geometry: countriesData[country].results[0].geometry
                };
            });

            return result;
        });
    }

};

module.exports = countriesDs;