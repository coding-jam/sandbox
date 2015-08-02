var _ = require("underscore");
var Q = require('q');
var locationData = require(__dirname + '/../data/it_locations');

var locationsDs = {

    findBy: function (areaLevel, shortName) {
        return Q.fcall(function () {
            var locationsFound = {};
            _.keys(locationData).forEach(function (key) {

                if (locationData[key].length > 0) {
                    var found = _.find(locationData[key][0].address_components, function (address) {
                        return _.contains(address.types, areaLevel)
                            && address.short_name && address.short_name.toLowerCase() == shortName.toLowerCase();
                    });

                    if (found) {
                        locationsFound[key] = locationData[key];
                    }
                }
            });

            return locationsFound;
        });
    },

    findRegioneBy: function (shortName) {
        return locationsDs.findBy('administrative_area_level_1', shortName);
    },

    findRegioni: function () {
        return Q.fcall(function () {
            var regions = [];
            _.keys(locationData).forEach(function (key) {
                if (locationData[key].length > 0 && isItaly(locationData[key][0].address_components)) {
                    var found = _.find(locationData[key][0].address_components, function (address) {
                        return _.contains(address.types, 'administrative_area_level_1');
                    });
                    if (found && found.short_name.length > 2) {
                        regions.push(found.short_name);
                    }
                }
            });
            return _.unique(regions).sort();
        });

        function isItaly(addresses) {
            var found = _.find(addresses, function (address) {
                return (_.contains(address.types, 'country') && address.short_name == 'IT');
            });
            return found;
        }
    }
}

module.exports = locationsDs;