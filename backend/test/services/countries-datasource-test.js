var countriesDs = require('../../services/countries-datasource');
var expect = require('chai').expect;

describe('Countries Datasource Test suite', function () {

    describe('getCountriesLocations', function () {

        it('should return all countries geo info', function (done) {

            countriesDs.getCountriesLocations()
                .then(function (countries) {
                    expect(countries).to.be.not.null;
                    expect(countries).to.be.a('object');
                    expect(countries).to.has.property('it');
                    expect(countries.it).to.has.property('name', 'Italia');
                    expect(countries.it).to.has.property('geometry');
                    expect(countries).to.has.property('uk');
                    expect(countries.uk).to.has.property('name', 'United Kingdom');
                    expect(countries.uk).to.has.property('geometry');
                    expect(countries).to.has.property('sp');
                    expect(countries.sp).to.has.property('name', 'España');
                    expect(countries.sp).to.has.property('geometry');
                    expect(countries).to.has.property('fr');
                    expect(countries.fr).to.has.property('name', 'France');
                    expect(countries.fr).to.has.property('geometry');
                })
                .done(done);
        });
    });

});