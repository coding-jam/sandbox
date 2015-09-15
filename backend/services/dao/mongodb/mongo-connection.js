var mongo = require('mongodb').MongoClient;

var url = process.env.OPENSHIFT_MONGODB_DB_URL || 'http://localhost:27017/gitmap';

console.log('MongoDB host: ' + process.env.OPENSHIFT_MONGODB_DB_HOST || 'localhost');

module.exports = function() {
    return mongo.connect(url);
}