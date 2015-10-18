"use strict";

var _ = require('lodash');
var Q = require('q');


var countriesDs = require('./dao/mongodb/countries-datasource');
var connectToDB = require('./dao/mongodb/mongo-connection');
var ghHttp = require('./gh-http');

var connect = _.compose(Q.when, connectToDB);

var etag_updater = {
    options : {
        maxNum: Number.MAX_VALUE
    },
    getEuropeCountries:  function () {
        return connect().then(function (db) {
            return countriesDs.getCountriesLocations(db);
        }).then(function (continent) {
            //FIXME : valid only for europe
            return _.keys(continent.europe.countries);
        });
    },
    getUsersByCountry: function (country) {
        return connectToDB().then(function (db) {
            return db.collection(country + "_users").find({}).limit(etag_updater.options.maxNum).toArray();
        });
    },
    getUsersUrlByCountry: function (country) {
        return connectToDB().then(function (db) {
            return db.collection(country + "_users").find({}).limit(etag_updater.options.maxNum).map(function (user) {
                return user.url;
            }).toArray();
        });
    },
    getEtagsByCountry: function(country) {
        return connectToDB().then(function (db) {
            return db.collection(country + "_users").find({}).limit(etag_updater.options.maxNum).map(function (user) {
                return user.url;
            }).map(function(url) {
                ghHttp.getWithLimit(url).then(function(res) {
                    console.log(res.response);
                })
            });
        });
    }
};

module.exports = etag_updater;