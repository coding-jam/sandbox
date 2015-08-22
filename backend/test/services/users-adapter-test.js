var userAdapter = require('../../services/users-adapter');
var expect = require('chai').expect;

describe('Users Adapter Test suite', function () {

    this.timeout(100000);
    this.slow(250000);

    describe('getByRegione', function () {

        it('should return italian users in Tuscany', function (done) {

            userAdapter.getByRegione('toscana')
                .then(function (users) {
                    expect(users).has.property('total_count');
                    expect(users).has.property('items');
                    expect(users.total_count).to.be.above(350);
                })
                .done(done);
        });

        it('should return italian users in Molise', function (done) {

            userAdapter.getByRegione('molise')
                .then(function (users) {
                    expect(users).has.property('total_count');
                    expect(users).has.property('items');
                    expect(users.total_count).to.be.least(6);
                })
                .done(done);
        });
    });

    describe('getUsersPerRegione', function() {

        it('should return italian users grouped by regions', function(done) {

            userAdapter.getUsersPerRegione('http://mock.url')
                .then(function(users) {
                    expect(users).has.property('usersInLocations');
                    expect(users.usersInLocations).to.have.length(20);
                    expect(users.usersInLocations).to.have.deep.property('[0].regionName');
                    expect(users.usersInLocations).to.have.deep.property('[0].usersDetails');
                    expect(users.usersInLocations).to.have.deep.property('[0].usersCount');
                    expect(users.usersInLocations).to.have.deep.property('[19].regionName');
                    expect(users.usersInLocations).to.have.deep.property('[19].usersDetails');
                    expect(users.usersInLocations).to.have.deep.property('[19].usersCount');
                })
                .done(done);
        });
    });
});