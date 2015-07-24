var qHttp = require('./q-http');
var Q = require('q');
var fs = require('fs')

var collector = {

    options : {
        resourceTemplate : 'https://api.github.com/search/users?q=created:%22{range}%22%20location:italy%20type:user&sort=joined&per_page=100',
        rageTemplate : [
            '{year}-01-01%20..%20{year}-03-31',
            '{year}-04-01%20..%20{year}-06-30',
            '{year}-07-01%20..%20{year}-10-31',
            '{year}-11-01%20..%20{year}-12-31'
        ]
    },

    collect : function() {

        var year = 2008;

        function executeRequest(i) {
            return qHttp.getWithLimit(createRange(collector.options.resourceTemplate, year, i))
                .then(function (resp) {
                    return resp.body;
                });

            function createRange(resource, year, i) {
                var range = collector.options.rageTemplate[i].replace(/\{year\}/g, year);
                return resource.replace('{range}', range);
            }
        }

        var allPromises = [];
        while (year < new Date().getFullYear()) {
            collector.options.rageTemplate.forEach(function(el, i) {
                allPromises.push(executeRequest(i));
                console.log('Esecuzione numero ' + (i + 1));
            });
            year++;
        }

        Q.all(allPromises).then(function(data) {
           console.log(data);
        }, function(error) {
            console.log('errore');
        } );
    }
}

module.exports = collector;