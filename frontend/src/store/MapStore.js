import Dispatcher from "src/Dispatcher";
import Events from "events";
import _ from "lodash";

var EventEmitter = Events.EventEmitter;

var locations = [];
var lastQuery = null;

Dispatcher.register(function(action) {
	var text;

	switch (action.actionType) {
		case "userByLanguageLoaded":
			lastQuery = action.query;
			Store.setLocations(action.regions);
			break;
	};
});

var Store = _.extend({
	setLocations: function(data) {
		locations = data;
		this.emit("LocationChanged");
	},
	getLocations: function(){
		return Object.freeze(locations);
	},
	getLastQuery:function(){
		return lastQuery;
	},
	addChangeListener: function(callback) {
		this.on("LocationChanged", callback);
	},
	removeChangeListener: function(callback) {
		this.removeListener("LocationChanged", callback);
	}
},EventEmitter.prototype);

export default Store;