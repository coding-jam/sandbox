var request = require("request");
var Q = require("q");

var qHttp = {

    requestLimit: 30,

    activeRequests: 0,

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
        qHttp.options.uri = url;
        request(qHttp.options, function (error, response, body) {
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

    getWithLimit: function(url) {

        return delayRequest(60000);

        function delayRequest(delay) {
            if (qHttp.activeRequests < qHttp.requestLimit) {
                return executeRequest();
            } else {
                console.log('Apply request delay of ' + (delay / 1000 / 60) + ' minute/s');
                return Q.delay(delay).then(function() {
                    return delayRequest(delay);
                });
            }
        }

        function executeRequest() {
            qHttp.options.uri = url;
            qHttp.activeRequests++

            console.log('Start new request. Active requests: ' + qHttp.activeRequests);

            var deferred = Q.defer();
            request(qHttp.options, function (error, response, body) {
                qHttp.activeRequests--
                if (error) {
                    console.log('Rejected. Active requests: ' + qHttp.activeRequests);
                    deferred.reject(error);
                } else {
                    console.log('Resolved. Active requests: ' + qHttp.activeRequests);
                    deferred.resolve({response: response, body: body});
                }
            });
            return deferred.promise;
        }
    }
}

module.exports = qHttp;