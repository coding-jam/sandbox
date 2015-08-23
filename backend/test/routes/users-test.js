var httpUtils = require('./http-utils');
var expect = require('chai').expect;
var _ = require('underscore');

describe('Users Routes Test suite', function () {

    this.timeout(100000);
    this.slow(1000000);

    before(function() {
        require('../../server');
    });

    describe('/users', function () {

        it('should return all italian region url', function (done) {

            httpUtils.getUri('/users')
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
