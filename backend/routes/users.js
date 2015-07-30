var express = require('express');
var _ = require("underscore");

var usersData = require(__dirname + '/../data/it_users');
var locationData = require(__dirname + '/../data/it_locations');

var router = express.Router();

router.get('/:regione', function (req, res) {
    var respData = {};
    _.keys(locationData).forEach(function (key) {

        var found = _.find(locationData[key].results, function (result) {
            var filtered = _.find(result.address_components, function (address) {
                return _.contains(address.types, 'administrative_area_level_1')
                    && address.short_name && address.short_name.toLowerCase() == req.params.regione.toLowerCase();
            });
            return !_.isEmpty(filtered);
        });

        if (found) {
            respData[key] = locationData[key];
        }
    });
    res.json(respData);
});

module.exports = router;