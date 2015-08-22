var _ = require("underscore");
var Q = require('q');
var districtsData = require(__dirname + '/../data/it_districts');
var countryMapping = require('./country-mappings');

var locationData = [];
locationData['it'] = require(__dirname + '/../data/it_locations');
locationData['uk'] = require(__dirname + '/../data/uk_locations');

var countryShortName = countryMapping.countryShortName;

function isCountry(addresses, country) {
    var found = _.find(addresses, function (address) {
        return (_.contains(address.types, 'country') && address.short_name == countryShortName[country]);
    });
    return found;
}

var locationsDs = {

    findBy: function (areaLevel, shortName) {
        return Q.fcall(function () {
            var locationsFound = {};
            var countryData = locationData['it'];
            _.keys(countryData).forEach(function (key) {

                if (countryData[key].length > 0) {
                    var found = _.find(countryData[key][0].address_components, function (address) {
                        return _.contains(address.types, areaLevel)
                            && address.short_name && address.short_name.toLowerCase() == shortName.toLowerCase();
                    });

                    if (found) {
                        locationsFound[key] = countryData[key];
                    }
                }
            });

            return locationsFound;
        });
    },

    findRegioneBy: function (shortName) {
        return locationsDs.findBy('administrative_area_level_1', shortName);
    },

    /**
     * Find regions from it_locations.json
     *
     * @returns a promise to italian districts
     */
    findRegioni: function () {
        return Q.fcall(function () {
            var regions = [];
            _.keys(locationData['it']).forEach(function (key) {
                var countryData = locationData['it'];
                if (countryData[key].length > 0 && isCountry(countryData[key][0].address_components, 'it')) {
                    var found = _.find(countryData[key][0].address_components, function (address) {
                        return _.contains(address.types, 'administrative_area_level_1');
                    });
                    if (found && found.short_name.length > 2) {
                        regions.push(found.short_name);
                    }
                }
            });
            return _.unique(regions).sort();
        });
    },

    findDistricts: function(country) {
        return Q.fcall(function () {
            var regions = [];
            var countryData = locationData[country];
            _.keys(countryData).forEach(function (key) {
                if (countryData[key].length > 0 && isCountry(countryData[key][0].address_components, country)) {
                    var found = _.find(countryData[key][0].address_components, function (address) {
                        return _.contains(address.types, countryMapping.districtLevel[country]);
                    });
                    if (found && found.short_name.length > 2) {
                        regions.push(found.short_name);
                    }
                }
            });
            return _.unique(regions).sort();
        });
    },

    getRegioniWithDetails: function () {
        return Q.when(districtsData);
    },

    getRegioni: function () {
        return Q.fcall(function () {
            return _.map(districtsData.districts, function (region) {
                return region.district;
            });
        });
    }

}

module.exports = locationsDs;