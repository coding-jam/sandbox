var NodeCache = require("node-cache");
var Q = require('q');
var _ = require('underscore');

var cache = new CacheAdapter({
    useClones: false,
    checkperiod: 0,
    cacheAll: true
});

module.exports = function (req, resp, next) {
    console.log('Requested url: ' + req.originalUrl);

    cache.addCacheCapabilities(resp, req.originalUrl);

    cache.get(req.originalUrl)
        .then(function (data) {
            console.log('Retrieving data from cache');
            resp.json(data);
        })
        .catch(function () {
            console.log('Processing new request');
            next();
        })
};

function CacheAdapter(options) {

    this.cache = new NodeCache(options);

    this.addCacheCapabilities = function (resp, url) {

        var jsonRef = resp.json;
        resp.json = function (data, cacheBody) {
            if (cacheBody || options.cacheAll) {
                cache.set(url, data);
            }
            jsonRef.apply(this, arguments);
        }
    }

    this.get = function (key) {
        var deferred = Q.defer();
        this.cache.get(key, function (err, value) {
            if (err) {
                deferred.reject(err);
            } else if (value == undefined) {
                deferred.reject('No value found!');
            } else {
                deferred.resolve(value);
            }
        });
        return deferred.promise;
    };

    this.set = function (key, value) {
        var deferred = Q.defer();
        this.cache.set(key, value, function (err, success) {
            if (err || !success) {
                deferred.reject(err);
            } else {
                deferred.resolve(success);
            }
        });
        return deferred.promise;
    };

    this.containsKey = function (key) {
        var deferred = Q.defer();
        this.cache.keys(function (err, keys) {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(_.contains(keys, key));
            }
        });
        return deferred.promise;
    };
}