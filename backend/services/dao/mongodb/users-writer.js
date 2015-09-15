#!/usr/bin/env node
var _ = require('underscore');
var usersDs = require('../files/users-datasource');
var countries = _.keys(require('../../country-mappings').countryShortName);
var db = require('./mongo-connection');
//db.getCollection('it_users').find({'languages.0' : {$exists: true}})

countries.forEach(function (country) {
    usersDs.getUsers(country)
        .then(function (users) {
            return users.items;
        })
        .then(function (users) {
            db().then(function (db) { // TODO: aggiungere la data creazione dei file come metadato
                    db.collection(country + '_users')
                        .insertMany(users)
                        .then(function (result) {
                            console.log(result.insertedCount + ' users inserted of country ' + country.toUpperCase());
                            db.close();
                        })
                        .catch(console.error);
                })
        });
})
