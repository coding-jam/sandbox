"use strict";

var _ = require('lodash');
var q = require('q');

var userAdapter = require('./adapters/mongodb/users-adapter');

var languages = require('./country-mappings.js').language;

var _getUsersByDistrict = _.curry(userAdapter.getUsersPerDistrict);

var getAllUsersByDistrict = _.map(languages, _getUsersByDistrict);

var _allUsers = function(){
    return q.all(getAllUsersByDistrict);
}


var etag_updater = {
    allUsers : _allUsers
};

module.exports = etag_updater;