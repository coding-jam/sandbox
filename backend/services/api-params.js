var api = {

    version: '/v1',
    basePath: '/api',
    domain: 'http://www.git-map.com',

    usersPath: '/users',
    languagesPath: '/languages',
    locationsPath: '/locations',

    getBaseUrl: function() {
        return api.domain + api.basePath + api.version
    },

    getApiPath: function() {
        return api.basePath + api.version
    }
}

module.exports = api