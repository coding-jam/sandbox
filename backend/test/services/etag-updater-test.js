/**
 * Created by albertorugnone on 11/10/15.
 */

'use strict';

var etagUpdater = require('../../services/etag-updater.js');
var chai = require('chai');
var expect = chai.expect;
var fail = chai.fail;

etagUpdater.options.maxNum = 5;

describe.only("Etag updater", function () {

    describe("if it requires all country", function () {

        var countriesResult;

        beforeEach(function (done) {
            etagUpdater.getEuropeCountries()
                .then(function (countries) {
                    countriesResult = countries;
                    return countriesResult;
                })
                .then(console.log)
                .catch(console.error)
                .finally(done);
        });

        it("receives a list of country as iso name", function () {
            expect(countriesResult).to.be.not.empty
        });
    });

    describe("if it requires all users", function () {

        var users;

        beforeEach(function (done) {
            etagUpdater.allUsers()
                .then(function (data) {
                    users = data;
                    return users;
                })
                .then(console.log)
                .catch(console.error)
                .finally(done);
        });

        it("receives a list of user from db", function () {
            expect(users).to.be.not.empty;
        });

    });

    describe("if it requires all users of Italy", function () {

        var italianUsers;

        beforeEach(function (done) {
            etagUpdater.getUsersByCountry("it")
                .then(function (users) {
                    italianUsers = users;
                })
                .then(console.log)
                .catch(console.error)
                .fin(done);
        });

        it("receive all italian users", function () {
            expect(italianUsers).to.be.not.empty;
        });
    });

    describe("if it requires all url for users of Italy", function () {

        var italianUsersUrl;

        beforeEach(function (done) {
            etagUpdater.getUsersUrlByCountry("it")
                .then(function (data) {
                    italianUsersUrl = data;
                    return italianUsersUrl;
                })
                .then(console.log)
                .catch(console.error)
                .fin(done);
        });

        it("receive all italian users", function () {
            expect(italianUsersUrl).to.be.not.empty;
        });
    });


    describe("if it requires all etags for users of Italy", function () {

        var italianEtags;

        etagUpdater.maxNum = 4;

        beforeEach(function (done) {
            etagUpdater.getEtagsByCountry("it")
                .then(function (etags) {
                    italianEtags = data;
                    return italianEtags;
                })
                .then(console.log)
                .catch(console.error)
                .fin(done);
        });

        it("receive all italian users", function () {
            expect(italianEtags).to.be.not.empty;
        });
    });

});
