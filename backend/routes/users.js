var express = require('express');
var _ = require("underscore");
var userAdapter = require(__dirname + "/../services/users-adapter");
var api = require(__dirname + '/../services/api-params');

var router = express.Router();

router.get('/', function (req, res) {
    userAdapter.getUsersPerRegione(api.getApiPath() + api.usersPath)
        .then(function(users) {
            res.json(users);
        });
});

router.get('/:regione', function (req, res) {
    userAdapter.getByRegione(req.params.regione)
        .then(function(users) {
            res.json(users);
        });
});

module.exports = router;