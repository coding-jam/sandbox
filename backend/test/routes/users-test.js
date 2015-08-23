var httpUtils = require('./http-utils');
var expect = require('chai').expect;
var _ = require('underscore');

describe('Users Routes Test suite', function () {

    this.timeout(100000);
    this.slow(1000000);

    before(function() {
        require('../../server');
    });

    describe('/users/:country', function () {

        it('should return all italian region url', function (done) {

            httpUtils.getUri('/users/it')
                .then(function(resp) {
                    expect(resp.body).to.have.property('usersInLocations');
                    var molise = _.find(resp.body.usersInLocations, function(location) {
                        return location.districtName == 'Molise';
                    });
                    expect(molise.usersCount).to.be.below(10);
                    expect(molise.usersDetails).to.be.equal('/api/v1/users/it/molise');
                })
                .done(done);
        });

        it('should return links to italian locations and languages', function (done) {

            httpUtils.getUri('/users/it')
                .then(function(resp) {
                    expect(resp.body).to.have.property('links');
                    expect(resp.body.links).to.be.a('object');
                    expect(resp.body.links).to.have.property('languages');
                    expect(resp.body.links).to.have.property('locationsDetails');
                    expect(resp.body.links.languages).to.be.equal('/api/v1/languages/it');
                    expect(resp.body.links.locationsDetails).to.be.equal('/api/v1/locations/it');
                })
                .done(done);
        });

        it('should return all uk region url', function (done) {

            httpUtils.getUri('/users/uk')
                .then(function(resp) {
                    expect(resp.body).to.have.property('usersInLocations');
                    expect(resp.body).to.have.property('links');

                    var molise = _.find(resp.body.usersInLocations, function(location) {
                        return location.districtName == 'Windsor and Maidenhead';
                    });
                    expect(molise.usersCount).to.be.least(35);
                    expect(molise.usersDetails).to.be.equal('/api/v1/users/uk/windsor%20and%20maidenhead');
                })
                .done(done);
        });

        it('should return links to uk locations and languages', function (done) {

            httpUtils.getUri('/users/uk')
                .then(function(resp) {
                    expect(resp.body).to.have.property('links');
                    expect(resp.body.links).to.be.a('object');
                    expect(resp.body.links).to.have.property('languages');
                    expect(resp.body.links).to.have.property('locationsDetails');
                    expect(resp.body.links.languages).to.be.equal('/api/v1/languages/uk');
                    expect(resp.body.links.locationsDetails).to.be.equal('/api/v1/locations/uk');
                })
                .done(done);
        });
    });

    describe('/:country/:district', function () {

        it('should return users in Molise, Italy', function(done) {

            httpUtils.getUri('/users/it/molise')
                .then(function(resp) {
                    expect(resp.body).to.have.property('total_count');
                    expect(resp.body).to.have.property('items');
                    expect(resp.body.items).is.a('array');
                    expect(resp.body.items).has.length.least(6);
                })
                .done(done);
        });

        it('should return users in Windsor and Maidenhead, UK', function(done) {

            httpUtils.getUri('/users/uk/windsor%20and%20maidenhead')
                .then(function(resp) {
                    expect(resp.body).to.have.property('total_count');
                    expect(resp.body).to.have.property('items');
                    expect(resp.body.items).is.a('array');
                    expect(resp.body.items).has.length.least(35);
                })
                .done(done);
        });

    });

});
