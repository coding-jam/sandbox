var express = require('express');
var _ = require("underscore");
var languagesAdapter = require(__dirname + "/../services/languages-adapter");

var router = express.Router();

router.get('/', function (req, res) {

    languagesAdapter.getRankedLanguages()
        .then(function(languages) {
            res.json(languages);
        });
});

router.get('/per-locations', function (req, res) {

    languagesAdapter.getLanguagesPerLocations()
        .then(function(languages) {
            res.json(languages);
        });
});

router.get('/:regione', function (req, res) {

    languagesAdapter.getRankedLanguages(req.params.regione)
        .then(function(languages) {
            res.json(languages);
        });
});

module.exports = router;