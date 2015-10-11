var chai = require('chai');
var mongodb = require('mongodb');
var assert = require('assert')

var MongoClient = mongodb.MongoClient;

var expect = chai.expect;

describe('Connection to db if develop is local', function () {
    it('should be open to mongodb://localhost:27017/', function() {

        var url = 'mongodb://localhost:27017/';

        MongoClient.connect(url, function(err, db) {
            expect(err).to.be.null;

            db.close();
        });
    }) ;
});


