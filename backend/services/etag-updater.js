"use strict";

var _ = require('lodash');
var Q = require('q');


var countriesDs = require('./dao/mongodb/countries-datasource');
var connect = require('./dao/mongodb/mongo-connection');

var toCollectionName = function (country) {
    return country + "_users";
}



var _allUsers = function () {
    return Q(["1"]);
}

var _allUsersToUrl = function () {
    var q = Q(["2"]);
    return q;
}

// _allEtafs :: Mongos.prototype.connect -> Url -> [String]
var _allEtags = function(dbConnection, gitHubUrl) {
    return Q([]);
}


var _allDistricts = function() {
    return Q.when(connect()).then(function(db) {
        return countriesDs.getCountriesLocations(db);
    });
}

var etag_updater = {
    allUsers: _allUsers,
    allEtags: _allEtags,
    allUsersToUrl: _allUsersToUrl,
    allDistrict: _allDistricts

};

module.exports = etag_updater;