var locationDs = require('../../services/locations-datasource');
var expect = require('chai').expect;

describe('Locations Datasource Test suite', function () {

    describe('findRegioni', function () {

        it('should return italian regions from locations.js', function (done) {

            locationDs.findRegioni()
                .then(function (regions) {
                    expect(regions).to.be.not.null;
                    expect(regions).is.a('array');
                    expect(regions).to.have.length(20);
                })
                .done(done);

        });
    });

    describe('getRegioni', function () {

        it('should return italian regions from regions.js', function (done) {

            locationDs.findRegioni()
                .then(function (regions) {
                    expect(regions).to.be.not.null;
                    expect(regions).is.a('array');
                    expect(regions).to.have.length(20);
                })
                .done(done);

        });
    });

});