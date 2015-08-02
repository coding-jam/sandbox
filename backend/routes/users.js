var express = require('express');
var _ = require("underscore");
var userAdapter = require(__dirname + "/../services/users-adapter");
var api = require(__dirname + '/../services/api-params');

var router = express.Router();

router.get('/', function (req, res) {
    userAdapter.getUsersPerRegione(api.getApiPath() + api.usersPath)
        .then(function(users) {
            var resBody = _.extend({}, users);
            addLanguagesInfo(resBody);
            res.json(resBody);
        });

    function addLanguagesInfo(resBody) {
        resBody.languages = api.getApiPath() + api.languagesPath;
        resBody.locations.forEach(function(location) {
            location.languages = location.url.replace(api.usersPath, api.languagesPath);
        });
    }
});

router.get('/:regione', function (req, res) {
    userAdapter.getByRegione(req.params.regione)
        .then(function(users) {
            res.json(users);
        });
});

module.exports = router;