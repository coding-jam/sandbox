#!/usr/bin/env node
var _ = require("underscore");
var collector = require('./services/data-collector');
var colors = require('colors');

var allowedLanguages = _.keys(collector.locationMapping);

var allowedActions = {

    "users": collector.collectUsers,
    "details": collector.collectUserDetails,
    "locations": collector.collectLocations
};

function logError() {
    console.log("RUN ERROR: please pass action and language".red);
    console.log("Available actions are:".underline);
    console.log(_.keys(allowedActions).join("\n").yellow);
    console.log("Available languages are:".underline);
    console.log(allowedLanguages.join("\n").yellow);
    console.log("i.e.: ./collector-runner.js collect-users it".green);
}


if (process.argv.length == 2 + 2) {
    var action = process.argv[2];
    var language = process.argv[3];

    if (_.keys(allowedActions).indexOf(action) != -1 && allowedLanguages.indexOf(language) != -1) {
        allowedActions[action](language)
            .then(function() {
                console.log("Done");
            })
            .catch(function(e) {
                console.error(e);
            });
    } else {
        logError();
    }
} else {
    logError();
}
