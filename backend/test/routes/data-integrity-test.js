var httpUtils = require('./http-utils');
var expect = require('chai').expect;
var _ = require('underscore');
var Q = require('q');

var locationsDs = require('../../services/locations-datasource');

describe('Data Integrity Tests', function () {

    this.timeout(100000);
    this.slow(1000000);

    before(function() {
        require('../../server');
    });

    describe('/users', function () {
        //FIXME: al momento escluso
        xit('should match total users count per country and districts', function (done) {

            httpUtils.getUri('/users')
                .then(function(resp) {
                    expect(resp.body).to.be.not.null;
                    expect(resp.body).to.have.property('usersInCounties');

                    Q.each(resp.body.usersInCounties, function(deferred, users) {
                        httpUtils.getUri(users.countryDetails)
                            .then(function (res) {
                                expect(res.body).to.have.property('usersInLocations');
                                var usersInCountry = _.chain(res.body.usersInLocations)
                                    .map(function (usersInDistrict) {
                                        return usersInDistrict.usersCount;
                                    })
                                    .reduce(function (memo, current) {
                                        return memo + current;
                                    })
                                    .value();

                                expect(users.usersCount).to.be.equal(usersInCountry);
                            })
                            .then(deferred.resolve)
                            .catch(deferred.reject);
                    })
                    .done(done);
                })
        });
    });
});