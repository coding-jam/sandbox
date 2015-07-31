var express = require('express');
var _ = require("underscore");
var userAdapter = require("../services/users-adapter")

var router = express.Router();

router.get('/:regione', function (req, res) {
    res.json(userAdapter.getByRegione(req.params.regione));
});

module.exports = router;