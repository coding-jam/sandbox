var usersDs = require('../../../../services/dao/mongodb/users-datasource');
var expect = require('chai').expect;

describe('Users Mongo Datasource Test suite', function () {

    this.timeout(100000);
    this.slow(250000);

    describe('findBy', function () {

        it('should return users in Molise, Italy', function (done) {

            usersDs.findBy('it', 'Molise')
                .then(function(users) {
                    expect(users).has.property('total_count');
                    expect(users.total_count).to.be.least(5);
                })
                .then(done)
                .catch(done);
        });

        it('should return users in Molise programming C', function (done) {

            usersDs.findBy('it', 'Molise', ['C'])
                .then(function(users) {
                    expect(users).has.property('total_count');
                    expect(users.total_count).to.be.least(2);
                })
                .then(done)
                .catch(done);
        });

        it('should return users in Molise programming Java and C', function (done) {

            usersDs.findBy('it', 'Molise', ['Java', 'C'])
                .then(function(users) {
                    expect(users).has.property('total_count');
                    expect(users.total_count).to.be.least(2);
                })
                .then(done)
                .catch(done);
        });
    });
});