var usersDs = require('../../services/users-datasource');
var expect = require('chai').expect;

describe('Users Datasource Test suite', function () {

    this.timeout(100000);
    this.slow(250000);

    describe('getUsers', function () {

        it('should return italian users from it_users folder', function (done) {

            usersDs.getUsers('it')
                .then(function (users) {
                    expect(users).has.property('total_count');
                    expect(users.total_count).to.be.above(5800);
                    expect(users).has.property('items');
                    expect(users.total_count).to.be.equal(users.items.length);
                })
                .done(done);
        });
    });

    describe('findBy', function () {

        it('should return users in molise', function (done) {

            usersDs.findBy('it', ['florence, italy'])
                .then(function(users) {
                    expect(users).has.property('total_count');
                    expect(users.total_count).to.be.least(64);
                })
                .done(done);
        });
    });
});