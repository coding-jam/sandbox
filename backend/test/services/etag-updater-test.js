/**
 * Created by albertorugnone on 11/10/15.
 */

'use strict';

var etagUpdater = require('../../services/etag-updater.js');
var chai = require('chai');
var expect = chai.expect;
var fail = chai.fail;

etagUpdater.options.maxNum = 5;

describe("Etag updater", function () {

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

    describe("if it requires all users of Italy", function () {

        var italianUsers;

        beforeEach(function (done) {
            etagUpdater.getUsersByCountry("it")
                .then(function (cursor) {
                    return cursor.toArray();
                })
                .then(function (users) {
                    italianUsers = users;
                })
                .then(console.log)
                .catch(console.error)
                .finally(done);
        });

        it("receive all italian users", function () {
            expect(italianUsers).to.be.not.empty;
        });
    });

    describe("if it requires all url for users of Italy", function () {

        var italianUsersUrl;

        beforeEach(function (done) {
            etagUpdater.getUsersUrlByCountry("it")
                .then(function(cursor) {
                    return cursor.toArray();
                })
                .then(function (urls) {
                    italianUsersUrl = urls;
                    return italianUsersUrl;
                })
                .then(console.log)
                .catch(console.error)
                .finally(done);
        });

        it("receive all italian users", function () {
            expect(italianUsersUrl).to.be.not.empty;
        });
    });

    describe("if it requires all etags for users of Italy", function () {

        var italianEtags;

        etagUpdater.maxNum = 4;

        beforeEach(function (done) {
            etagUpdater.getETagsByCountry("it")
                .then(function(cursor) {
                    return cursor.toArray();
                })
                .then(function (etags) {
                    italianEtags = etags;
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

    describe.only("if it requires etags for alberto", function () {

        var albertoEtag;

        etagUpdater.maxNum = 4;

        beforeEach(function (done) {
            etagUpdater.toEtags("https://api.github.com/users/albertorugnone")
                .then(function (etags) {
                    albertoEtag = etag;
                    return albertoEtag;
                })
                .then(console.log)
                .catch(console.error)
                .fin(done);
        });

        it("receive all italian users", function () {
            expect(albertoEtag).to.be.not.null;
        });
    });

});
