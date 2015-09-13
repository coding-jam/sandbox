var events = require('events');
var eventEmitter = new events.EventEmitter();

var emitter = {

    emit: function (eventName, data) {
        eventEmitter.emit(eventName, data);
    },

    on: function (eventName, callback) {
        eventEmitter.on(eventName, callback);
    },

    emitRespBody: function (url, data) {
        emitter.emit('responseBody', {url: url, data: data});
    },

    onRespBody: function (callback) {
        if (events.EventEmitter.listenerCount(eventEmitter, 'responseBody') == 0) {
            emitter.on('responseBody', callback);
        }
    }

};

module.exports = emitter;