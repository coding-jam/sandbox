var languagesAdapter = require('../../services/languages-adapter');
var expect = require('chai').expect;
var _ = require('underscore');

describe('Languages Adapter Test suite', function () {

    this.timeout(100000);
    this.slow(250000);

    describe('getRankedLanguages', function () {

        it('should return all languages used in Italy order by most used', function (done) {

            languagesAdapter.getRankedLanguages()
                .then(expectedAssertions)
                .done(done);
        });
    });

    describe('getRankedLanguages', function () {

        it('should return all languages used in Tuscany order by most used', function (done) {

            languagesAdapter.getRankedLanguages('toscana')
                .then(expectedAssertions)
                .done(done);
        });
    });

    function expectedAssertions(languages) {
            expect(languages).not.null;
            expect(languages).to.be.a('array');
            expect(languages).to.have.deep.property('[0].language');
            expect(languages).to.have.deep.property('[1].usersPerLanguage');
            expect(_.first(languages).usersPerLanguage).to.be.above(_.last(languages).usersPerLanguage);
    }
});