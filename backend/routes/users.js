var express = require('express');
var _ = require("underscore");
var userAdapter = require(__dirname + "/../services/users-adapter");
var api = require(__dirname + '/../services/api-params');

var router = express.Router();

router.get('/:country', function (req, res) {
    userAdapter.getUsersPerDistrict(req.params.country, api.getApiPath() + api.usersPath + '/' + req.params.country)
        .then(function(users) {
            var resBody = _.extend({}, users);
            resBody.links = {};
            addLanguagesInfo(resBody, req.params.country);
            addLocationsInfo(resBody, req.params.country);
            res.json(resBody);
        });

    function addLanguagesInfo(resBody, country) {
        resBody.links.languages = api.getApiPath() + api.languagesPath + '/' + country;
        resBody.usersInLocations.forEach(function(location) {
            location.languages = location.usersDetails.replace(api.usersPath, api.languagesPath);
        });
    }

    function addLocationsInfo(resBody, country) {
        resBody.links.locationsDetails = api.getApiPath() + api.locationsPath + '/' + country;
    }
});

router.get('/:country/:district', function (req, res) {
    userAdapter.getByDistrict(req.params.country, req.params.district)
        .then(function(users) {
            res.json(users);
        });
});

module.exports = router;