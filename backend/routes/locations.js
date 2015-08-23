var express = require('express');
var _ = require("underscore");
var locationsDs = require(__dirname + "/../services/locations-datasource");
var api = require(__dirname + '/../services/api-params');

var router = express.Router();

router.get('/:country', function (req, res) {
    locationsDs.getDistrictsWithDetails(req.params.country)
        .then(function(districts) {
            res.json(districts);
        });
});

module.exports = router;