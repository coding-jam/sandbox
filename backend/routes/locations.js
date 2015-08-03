var express = require('express');
var _ = require("underscore");
var locationsDs = require(__dirname + "/../services/locations-datasource");
var api = require(__dirname + '/../services/api-params');

var router = express.Router();

router.get('/', function (req, res) {
    locationsDs.getRegioniWithDetails()
        .then(function(regions) {
            res.json(regions);
        });
});

module.exports = router;