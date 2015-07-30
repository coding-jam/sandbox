var express = require('express');
var _ = require("underscore");

var usersData = require(__dirname + '/../data/it_users');
var locationData = require(__dirname + '/../data/it_locations');

var router = express.Router();

router.get('/:regione', function (req, res) {
    var respData = {};
    _.keys(locationData).forEach(function (key) {

        if (locationData[key].length > 0) {
            var found = _.find(locationData[key][0].address_components, function (address) {
                return _.contains(address.types, 'administrative_area_level_1')
                    && address.short_name && address.short_name.toLowerCase() == req.params.regione.toLowerCase();
            });

            if (found) {
                respData[key] = locationData[key];
            }
        }
    });
    res.json(respData);
});

module.exports = router;