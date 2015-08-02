var express = require('express');
var _ = require("underscore");
var userAdapter = require(__dirname + "/../services/users-adapter")

var router = express.Router();

router.get('/:regione', function (req, res) {
    userAdapter.getByRegione(req.params.regione)
        .then(function(users) {
            res.json(users);
        });
});

module.exports = router;