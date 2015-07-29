var request = require("request");
var Q = require("q");
var _ = require("underscore");

var geolocator = {

    secrets: 'key=AIzaSyAlSne2x3ZJufuyPrK0imC36SOiqY76hDg',

    rateLimit: {
        seconds: {
            limit: 5,
            interval: 1 * 1000
        },
        day: {
            limit: 2500,
            interval: 24 * 60 * 60 * 1000
        },
        queue: {
            limit: 50,
            interval: 15 * 1000
        },
        activeRequests: 0,

    },

    badStatus: ['OVER_QUERY_LIMIT', 'REQUEST_DENIED', 'INVALID_REQUEST', 'UNKNOWN_ERROR'],

    options: {
        method: "GET",
        timeout: 1000000,
        followRedirect: true,
        maxRedirects: 10,
        json: true
    },

    locate: function(query) {

        if (geolocator.rateLimit.activeRequests < geolocator.rateLimit.day.limit) {
            return execOrdelayRequest(query);
        } else {
            console.info('Requests per day limit of ' + geolocator.rateLimit.day.limit + ' exceeded, add delay of ' + (geolocator.rateLimit.day.interval / 1000) + ' seconds');
            return delayRequest(geolocator.rateLimit.day.interval);
        }

        function execOrdelayRequest(query) {
            if (geolocator.rateLimit.activeRequests < geolocator.rateLimit.seconds.limit) {
                console.info('Execute request now');
                return executeRequest(query);
            } else {
                console.info('Requests per seconds limit of ' + geolocator.rateLimit.seconds.limit + ' exceeded, add delay of ' + (geolocator.rateLimit.seconds.interval / 1000) + ' seconds');
                return delayRequest(geolocator.rateLimit.seconds.interval);
            }
        }

        function delayRequest(delay) {
            return Q.delay(delay).then(geolocator.locate);
        }

        function executeRequest(query) {
            var options = _.clone(geolocator.options);
            options.uri = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + query + '&region=it&' + geolocator.secrets;
            geolocator.rateLimit.activeRequests++

            console.log('Start new request. Active requests: ' + geolocator.rateLimit.activeRequests);

            var deferred = Q.defer();
            request(options, function (error, response, body) {
                geolocator.rateLimit.activeRequests--
                if (error || _.contains(geolocator.badStatus, body.status)) {
                    console.log('Rejected. Active requests: ' + geolocator.rateLimit.activeRequests);
                    if (body.status == 'OVER_QUERY_LIMIT') {
                        resetQueryLimit();
                    }
                    deferred.reject(error || body);
                } else {
                    console.log('Resolved. Active requests: ' + geolocator.rateLimit.activeRequests);
                    deferred.resolve({response: response, body: body});
                }
            });
            return deferred.promise;

            function resetQueryLimit() {
                var originaDaylLimit = geolocator.rateLimit.day.limit;
                var originaSecondslLimit = geolocator.rateLimit.seconds.limit;
                geolocator.rateLimit.day.limit = 0;
                geolocator.rateLimit.seconds.limit = 0;
                Q.delay(geolocator.rateLimit.day.interval)
                    .then(function() {
                        geolocator.rateLimit.day.limit = originaDaylLimit;
                        geolocator.rateLimit.seconds.limit = originaSecondslLimit;
                    });
            }
        }
    }
}

module.exports = geolocator;