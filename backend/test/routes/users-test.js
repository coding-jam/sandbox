var languagesAdapter = require('../../services/languages-adapter');
var apiParams = require('../../services/api-params');
var expect = require('chai').expect;
var _ = require('underscore');
var request = require('request');
var Q = require('q');

describe('Users Routes Test suite', function () {

    this.timeout(100000);
    this.slow(1000000);

    var options = {
        method: "GET",
        timeout: 1000000,
        followRedirect: true,
        maxRedirects: 10,
        json: true
    };

    function getUri(uri) {
        options.uri = 'http://localhost:8080' + apiParams.getApiPath() + uri;
        return Q.nfcall(request, options)
            .then(function(resp) {
                return {header: resp[0], body: resp[1]};
            });
    }

    before(function() {
        require('../../server');
    });

    describe('/users', function () {

        it('should return all italian region url', function (done) {

            getUri('/users')
                .then(function(resp) {
                    expect(resp.body).to.have.property('usersInLocations');
                    expect(resp.body).to.have.property('links');

                    var molise = _.find(resp.body.usersInLocations, function(location) {
                        return location.regionName == 'Molise';
                    });
                    expect(molise.usersCount).to.be.below(10);
                })
                .done(done);
        });
    });

});
