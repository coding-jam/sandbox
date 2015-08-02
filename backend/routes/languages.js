var express = require('express');
var _ = require("underscore");
//var userAdapter = require(__dirname + "/../services/users-adapter")

var router = express.Router();

router.get('/', function (req, res) {
    console.log(__dirname);
    res.json({
        'Java': 15434,
        'JavaScript': 3222
    });
});

module.exports = router;