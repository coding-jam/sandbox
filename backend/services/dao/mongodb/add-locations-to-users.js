#!/usr/bin/env node
var Q = require('q');
var _ = require('underscore');
var locationsDs = require('../files/locations-datasource');
var countryMappings = require('./../../country-mappings');
var db = require('./mongo-connection');
require('../../utils');

var countries = _.keys(countryMappings.language);

countries.forEach(function (country) {

    var locations = locationsDs._getLocationData(country);

    db()
        .then(function (db) {
            var collection = db.collection(country + '_users');
            var users = collection.find({});
            users.count(false)
                .then(function (count) {
                    var i = 0;
                    users.forEach(function (user) {
                        //console.log('country: ' + country + ', count: ' + count + ', iteration ' + i)
                        if (user.location) {
                            var geolocation = locations[user.location.toLowerCase()];
                            if (geolocation && geolocation.length > 0) {
                                collection.updateOne({_id: user._id},
                                    {
                                        $set: {'gitmap.geolocation': geolocation[0]}
                                    })
                                    .then(function () {
                                        if (++i == count) {
                                            db.close();
                                        }
                                    })
                                    .catch(console.error);
                            } else {
                                console.log(country + ' --- ' + user.location.toLowerCase());
                                ++i;
                            }
                        } else {
                            ++i;
                        }
                    });
                })
        });
});