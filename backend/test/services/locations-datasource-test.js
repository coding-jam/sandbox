var locationDs = require('../../services/locations-datasource');
var expect = require('chai').expect;

describe('Locations Datasource Test suite', function () {

    describe('findRegioneBy', function () {

        it('should return italian locations from region name', function (done) {

            locationDs.findRegioneBy('molise')
                .then(function (region) {
                    expect(region).to.be.not.null;
                    expect(region).is.a('object');
                    expect(region).to.have.property('isernia, italy');
                })
                .done(done);

        });
    });

    describe('findRegioni', function () {

        it('should return italian regions from locations.js (slow)', function (done) {

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

            locationDs.getRegioni()
                .then(function (regions) {
                    expect(regions).to.be.not.null;
                    expect(regions).is.a('array');
                    expect(regions).to.have.length(20);
                })
                .done(done);

        });
    });

    describe('findLocationsBy', function () {

        it('should return italian locations from region name', function (done) {

            locationDs.findLocationsBy('it', 'molise')
                .then(function (region) {
                    expect(region).to.be.not.null;
                    expect(region).is.a('object');
                    expect(region).to.have.property('isernia, italy');
                })
                .done(done);

        });

        it('should return uk locations from district name', function (done) {

            locationDs.findLocationsBy('uk', 'windsor and maidenhead')
                .then(function (region) {
                    expect(region).to.be.not.null;
                    expect(region).is.a('object');
                    expect(region).to.have.property('windsor, uk');
                })
                .done(done);

        });
    });

    describe('findDistricts', function () {

        it('should return italian regions from locations.js', function (done) {

            locationDs.findDistricts('it')
                .then(function (regions) {
                    expect(regions).to.be.not.null;
                    expect(regions).is.a('array');
                    expect(regions).to.have.length(20);
                })
                .done(done);
        });

        it('should return uk districts from locations.js', function (done) {

            locationDs.findDistricts('uk')
                .then(function (regions) {
                    expect(regions).to.be.not.null;
                    expect(regions).is.a('array');
                    expect(regions).to.have.length(147);
                })
                .done(done);
        });
    });

    describe('getDistricts', function () {

        it('should return italian regions from regions.js', function (done) {

            locationDs.getDistricts('it')
                .then(function (regions) {
                    expect(regions).to.be.not.null;
                    expect(regions).is.a('array');
                    expect(regions).to.have.length(20);
                })
                .done(done);

        });

        it('should return uk districts from regions.js', function (done) {

            locationDs.getDistricts('uk')
                .then(function (regions) {
                    expect(regions).to.be.not.null;
                    expect(regions).is.a('array');
                    expect(regions).to.have.length(147);
                })
                .done(done);

        });
    });

    describe('getDistrictsWithDetails', function () {

        it('should return italian regions from it_districts.js', function (done) {

            locationDs.getDistrictsWithDetails('it')
                .then(function (districts) {
                    expect(districts).to.be.not.null;
                    expect(districts).to.have.property('districts');
                    expect(districts.districts).is.a('array');
                    expect(districts.districts).to.have.length(20);
                })
                .done(done);

        });

        it('should return uk districts from uk_districts.js', function (done) {

            locationDs.getDistrictsWithDetails('uk')
                .then(function (districts) {
                    expect(districts).to.be.not.null;
                    expect(districts).to.have.property('districts');
                    expect(districts.districts).is.a('array');
                    expect(districts.districts).to.have.length(147);
                })
                .done(done);

        });

    });

    describe('getLocationsOutOfDistricts', function () {

        function expectLeast(locations, count) {
            expect(locations).to.be.not.null;
            expect(locations).to.be.a('array');
            expect(locations).to.be.have.length.least(count);
        }

        it('should return location non localized in districts in Italy', function (done) {

            locationDs.getLocationsOutOfDistricts('it')
                .then(function (locations) {
                    expectLeast(locations, 37);
                })
                .done(done);
        });

        it('should return location non localized in districts in Uk', function (done) {

            locationDs.getLocationsOutOfDistricts('uk')
                .then(function (locations) {
                    expectLeast(locations, 319);
                })
                .done(done);
        });

        it('should return location non localized in districts in Spain', function (done) {

            locationDs.getLocationsOutOfDistricts('sp')
                .then(function (locations) {
                    console.log(locations) //FIXME: sono troppi quelli non trovati!
                    expectLeast(locations, 583);
                })
                .done(done);
        });

        it.only('should return location non localized in districts in French', function (done) {

            locationDs.getLocationsOutOfDistricts('fr')
                .then(function (locations) {
                    expectLeast(locations, 69);
                })
                .done(done);
        });

    });

});