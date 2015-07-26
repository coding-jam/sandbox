var request = require("request");
var Q = require("q");
var _ = require("underscore");

var ghHttp = {

    rateLimit: {
        requests: {
            limit: 5000,
            interval: 60 * 60 * 1000,
            activeRequests: 0
        },
        search: {
            limit: 30,
            interval: 1 * 60 * 1000,
            activeRequests: 0
        }
    },

    options: {
        method: "GET",
        timeout: 10000,
        followRedirect: true,
        maxRedirects: 10,
        headers: {
            'User-Agent': 'gitmap'
        }
    },

    get: function (url) {

        var deferred = Q.defer();
        ghHttp.options.uri = url;
        request(ghHttp.options, function (error, response, body) {
            if (error) {
                console.log('REJECT:');
                deferred.reject(error);
            } else {
                console.log('RESOLVE:');
                deferred.resolve({response: response, body: body});
            }
        });

        return deferred.promise;
    },

    getWithLimit: function(url, isSearch) {

        if (isSearch) {
            return delayRequest(ghHttp.rateLimit.search);
        } else {
            return delayRequest(ghHttp.rateLimit.requests);
        }

        function delayRequest(limitParams) {
            if (limitParams.activeRequests < limitParams.limit) {
                return executeRequest(limitParams);
            } else {
                console.log('Apply request delay of ' + (limitParams.interval / 1000 / 60) + ' minute/s');
                return Q.delay(limitParams.interval).then(function() {
                    return delayRequest(limitParams);
                });
            }
        }

        function executeRequest(limitParams) {
            var options = _.clone(ghHttp.options);
            options.uri = url;
            limitParams.activeRequests++

            console.log('Start new request. Active requests: ' + limitParams.activeRequests);

            var deferred = Q.defer();
            request(options, function (error, response, body) {
                limitParams.activeRequests--
                if (error) {
                    console.log('Rejected. Active requests: ' + limitParams.activeRequests);
                    deferred.reject(error);
                } else {
                    console.log('Resolved. Active requests: ' + limitParams.activeRequests);
                    deferred.resolve({response: response, body: body});
                }
            });
            return deferred.promise;
        }
    }
}

module.exports = ghHttp;