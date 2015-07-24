var qHttp = require('./q-http');
var Q = require('q');
var fs = require('fs')

var collector = {

    options: {
        secrets: 'client_id=51f5e69c42514ef98707&client_secret=a57c2fabcf4f3c655d9381b2c56134f76fa8fdc5',
        resourceTemplate: 'https://api.github.com/search/users?q=created:%22{range}%22%20location:italy%20type:user&sort=joined&per_page=100&{secret}',
        rangeTemplate: [
            '{year}-01-01%20..%20{year}-03-31',
            '{year}-04-01%20..%20{year}-06-30',
            '{year}-07-01%20..%20{year}-09-30',
            '{year}-10-01%20..%20{year}-12-31'
        ]
    },

    collect: function () {

        var year = 2008;

        var allPromises = [];
        while (year <= new Date().getFullYear()) {
            collector.options.rangeTemplate.forEach(function (el, i) {
                allPromises.push(executeRequest(i));
            });
            year++;
        }

        Q.all(allPromises).then(function (data) {
            saveUsers(data);
        }, function (error) {
            console.error('ERROR!! ' + error.message);
        });

        function executeRequest(i) {
            var url = collector.options.resourceTemplate.replace(/\{secret\}/g, collector.options.secrets);
            return qHttp.getWithLimit(createRange(url, year, i))
                .then(function (resp) {
                    return resp.body;
                });

            function createRange(resource, year, i) {
                var range = collector.options.rangeTemplate[i].replace(/\{year\}/g, year);
                console.log('Query range ' + range);
                return resource.replace('{range}', range);
            }
        }

        function saveUsers(data) {
            var result = {
                total_count: 0,
                items: []
            };

            data.forEach(function (json, i) {
                var jsonObj = JSON.parse(json);
                if (jsonObj.total_count != undefined) {
                    result.total_count = result.total_count + jsonObj.total_count;
                    result.items = result.items.concat(jsonObj.items);
                } else {
                    console.error('Found json: ' + json)
                }
            });
            var fileName = 'it_users.json';
            fs.writeFile(__dirname + '/data/' + fileName, JSON.stringify(result), function (err) {
                if (err) {
                    console.error(err);
                }

                console.log(fileName + ' saved');
            });
            console.log('Total users found ' + result.total_count);
        }
    }
}

module.exports = collector;