var apiParams = require('../../services/api-params');
var request = require('request');
var Q = require('q');
var _ = require('underscore');

var httpUtil = {

    options: {
        method: "GET",
        timeout: 1000000,
        followRedirect: true,
        maxRedirects: 10,
        json: true
    },

    getUri: function (uri) {
        var localUri = uri.indexOf(apiParams.getApiPath()) != -1 ? uri : apiParams.getApiPath() + uri;
        var options = _.extend({}, httpUtil.options);
        options.uri = 'http://localhost:8080' + localUri;
        return Q.nfcall(request, options)
            .then(function (resp) {
                return {header: resp[0], body: resp[1]};
            });
    }
}

module.exports = httpUtil;