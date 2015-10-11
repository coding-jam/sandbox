/**
 * Created by albertorugnone on 11/10/15.
 */

'use strict';

var etagUpdater = require('../../services/etag-updater.js');
var chai = require('chai');
var expect = chai.expect;


describe("Starting etag updater", function() {
    it("updater has to be defined", function() {
        expect(etagUpdater).to.be.not.null;
    });

    it("function to get all user is define", function() {
        expect(etagUpdater.allUsers).to.be.not.null;
    });

    describe("if etagUpdater require all users", function() {

        var users;
        beforeEach(function(done){
           etagUpdater.allUsers()
               .then(function(data) {
                   users = data;
                   done();
               });

        });

       it("receive a list of user from db", function() {
            expect(users).to.be.not.empty;
       }) ;

    });

});
