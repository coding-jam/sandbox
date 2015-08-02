import Dispatcher from "src/Dispatcher";
import Events from "events";
import _ from "underscore";

var EventEmitter = Events.EventEmitter;

var locations = [];

Dispatcher.register(function(action) {
	var text;

	switch (action.actionType) {
		case "listaRegioniLoaded":
			Store.setLocations(action.locations);
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
	addChangeListener: function(callback) {
		this.on("LocationChanged", callback);
	},
	removeChangeListener: function(callback) {
		this.removeListener("LocationChanged", callback);
	}
},EventEmitter.prototype);

export default Store;