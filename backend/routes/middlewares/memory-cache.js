var bus = require('../event-bus');
var NodeCache = require("node-cache");
var Q = require('q');
var _ = require('underscore');

var cache = new CacheAdapter();

module.exports = function(req, resp, next) {
    console.log('Requested url: ' + req.originalUrl);

    bus.onRespBody(function(data) {
        cache.set(data.url, data.data)
            .catch(function (err) {
                console.error(err);
            });
    });

    cache.get(req.originalUrl)
        .then(function (data) {
            console.log('Retrieving data from cache');
            resp.json(data);
        })
        .catch(function () {
            console.log('Processing new request');
            next();
        })
}

function CacheAdapter() {

    this.cache = new NodeCache({
        useClones: false,
        checkperiod: 0
    });

    this.get = function(key) {
        var deferred = Q.defer();
        this.cache.get(key, function (err, value) {
            if(err) {
                deferred.reject(err);
            } else if (value == undefined) {
                deferred.reject('No value found!');
            } else {
                deferred.resolve(value);
            }
        });
        return deferred.promise;
    };

    this.set = function(key, value) {
        var deferred = Q.defer();
        this.cache.set(key, value, function(err, success) {
            if(err || !success) {
                deferred.reject(err);
            } else {
                deferred.resolve(success);
            }
        });
        return deferred.promise;
    };

    this.containsKey = function(key) {
        var deferred = Q.defer();
        this.cache.keys(function (err, keys) {
            if(err) {
                deferred.reject(err);
            } else {
                deferred.resolve(_.contains(keys, key));
            }
        });
        return deferred.promise;
    };
}