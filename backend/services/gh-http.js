var request = require("request");
var requestSync = require('sync-request');
var Q = require("q");
var _ = require("underscore");

var ghHttp = {

    secrets: 'client_id=51f5e69c42514ef98707&client_secret=a57c2fabcf4f3c655d9381b2c56134f76fa8fdc5',

    rateLimit: {
        requests: {
            limit: 5000,
            interval: 60 * 60 * 1000,
            resetTime: 0
        },
        search: {
            limit: 30,
            interval: 1 * 60 * 1000,
            resetTime: 0
        },
        queue: {
            limit: 50,
            interval: 15 * 1000
        },
        activeRequests: 0,

    },

    options: {
        method: "GET",
        timeout: 1000000,
        followRedirect: true,
        maxRedirects: 10,
        headers: {
            'User-Agent': 'gitmap'
        }
    },

    getWithLimit: function(url, isSearch) {

        if (ghHttp.rateLimit.activeRequests < ghHttp.rateLimit.queue.limit) {
            return execOrdelayRequest(isSearch ? ghHttp.rateLimit.search : ghHttp.rateLimit.requests);
        } else {
            console.info('Queue limit of ' + ghHttp.rateLimit.queue.limit + ' exceeded, add delay of ' + (ghHttp.rateLimit.queue.interval / 1000) + ' seconds');
            return delayRequest(ghHttp.rateLimit.queue.interval, url, isSearch);
        }

        function execOrdelayRequest(limitParams) {
            if (ghHttp.rateLimit.activeRequests < limitParams.limit || limitParams.resetTime < Math.floor(Date.now() / 1000)) {
                console.info('Execute request now: limit set to ' + limitParams.limit);
                return executeRequest(limitParams);
            } else {
                var interval = limitParams.resetTime - Math.floor(Date.now() / 1000);
                console.log('Apply request delay of ' + (interval) + ' seconds');
                return delayRequest(interval * 1000, url, isSearch);
            }
        }

        function delayRequest(delay, url, isSearch) {
            return Q.delay(delay).then(function() {
                return ghHttp.getWithLimit(url, isSearch);
            });
        };

        function executeRequest(limitParams) {
            var options = _.clone(ghHttp.options);
            options.uri = url;
            ghHttp.rateLimit.activeRequests++

            console.log('Start new request. Active requests: ' + ghHttp.rateLimit.activeRequests);

            var deferred = Q.defer();
            request(options, function (error, response, body) {
                ghHttp.rateLimit.activeRequests--
                if (error) {
                    console.log('Rejected. Active requests: ' + ghHttp.rateLimit.activeRequests);
                    deferred.reject(error);
                } else {
                    ghHttp.updateLimits(response, limitParams);
                    console.log('Resolved. Active requests: ' + ghHttp.rateLimit.activeRequests);
                    var responseObj = {response: response, body: body};
                    if (response.headers['content-type'].match('application/json')) {
                        responseObj.body = JSON.parse(body);
                    }
                    deferred.resolve(responseObj);
                }
            });
            return deferred.promise;
        }
    },

    updateLimits: function (response, limitParams) {
        limitParams.limit = response.headers['x-ratelimit-remaining'];
        limitParams.resetTime = response.headers['x-ratelimit-reset'];
    },

    setupApiLimits: function() {

        var headers = _.extend({}, ghHttp.options.headers);
        headers['If-None-Match'] = 'W/"bbb234d54455c9ae9fe93d66e6c041a1"';
        getLimitsFor(ghHttp.rateLimit.requests, 'https://api.github.com/users/cosenonjaviste?');
        getLimitsFor(ghHttp.rateLimit.search, 'https://api.github.com/search/users?q=cosenonjaviste%20in:name%20type:user&');

        function getLimitsFor(limitParams, url) {
            var res = requestSync('GET', url + ghHttp.secrets, {
                'headers': headers
            });
            ghHttp.updateLimits(res, limitParams);
        };
    }
}

ghHttp.setupApiLimits();

module.exports = ghHttp;