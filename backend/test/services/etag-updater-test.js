/**
 * Created by albertorugnone on 11/10/15.
 */

'use strict';

var etagUpdater = require('../../services/etag-updater.js');
var chai = require('chai');
var expect = chai.expect;
var fail = chai.fail;


describe("Starting etag updater", function () {
    it("updater has to be defined", function () {
        expect(etagUpdater).to.be.not.null;
    });

    it("function to get all user is define", function () {
        expect(etagUpdater.allUsers).to.be.not.null;
    });

});

describe.only("if it requires all district", function() {
    var countries;
    beforeEach(function (done) {
        etagUpdater.allDistrict()
            .then(function (data) {
                countries = data.europe.countries;
            }) .catch(console.error)
            .finally(done);
    });

    it("receives a list of district", function(){
        expect(countries).to.be.not.empty;

    });

});


describe("if it requires all users", function () {

    var users;
    beforeEach(function (done) {
        etagUpdater.allUsers()
            .then(function (data) {
                users = data;
                users.forEach(function(user) {
                    console.log(user.id)
                });
            }) .catch(console.error)
            .finally(done);
    });

    it("receives a list of user from db", function () {
        expect(users).to.be.not.empty;
    });

});

describe("if it requires all url", function () {
    var urls;

    beforeEach(function (done) {
        console.log("" + etagUpdater.allUsersToUrl);
        etagUpdater.allUsersToUrl()
            .then(function (data) {
                urls = data;
            })
            .catch(console.error)
            .finally(done);
    });


    it("receives a list of url", function () {
        console.log("" + urls);
        urls.forEach(console.log);
        expect(urls).to.be.not.empty;
    });
});

describe("if it requires all etags", function () {
    var etags;

    beforeEach(function (done) {
        etagUpdater.allEtags()
            .then(function (data) {
                etags = data;
            })
            .catch(console.error)
            .finally(done);
    });

    it("receives a list of etags", function () {
        console.log("" + etags);
        etags.forEach(console.log);
        expect(etags).to.be.not.empty;

    });

});

