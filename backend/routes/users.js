var express = require('express');
var _ = require("underscore");
var userAdapter = require(__dirname + "/../services/users-adapter");
var api = require(__dirname + '/../services/api-params');

var router = express.Router();

router.get('/', function (req, res) {
    userAdapter.getUsersPerRegione(api.getApiPath() + api.usersPath)
        .then(function(users) {
            var resBody = _.extend({}, users);
            resBody.links = {};
            addLanguagesInfo(resBody);
            addLocationsInfo(resBody);
            res.json(resBody);
        });

    function addLanguagesInfo(resBody) {
        resBody.links.languages = api.getApiPath() + api.languagesPath;
        resBody.usersInLocations.forEach(function(location) {
            location.languages = location.usersDetails.replace(api.usersPath, api.languagesPath);
        });
    }

    function addLocationsInfo(resBody) {
        resBody.links.locationsDetails = api.getApiPath() + api.locationsPath;
    }
});

router.get('/:regione', function (req, res) {
    userAdapter.getByRegione(req.params.regione)
        .then(function(users) {
            res.json(users);
        });
});

module.exports = router;