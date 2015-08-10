import Dispatcher from "src/Dispatcher";
import Events from "events";
import _ from "lodash";

var EventEmitter = Events.EventEmitter;

var usersData = {};

Dispatcher.register(function(action) {
	var text;

	switch (action.actionType) {
		case "userByLocationLoaded":
			Store.setData(_.omit(action,'actionType'));
			break;
	};
});

var Store = _.extend({
	setData: function(data) {
		usersData = data;
		this.emit("UserLoaded");
	},
	getData: function(){
		return Object.freeze(usersData);
	},
	addChangeListener: function(callback) {
		this.on("UserLoaded", callback);
	},
	removeChangeListener: function(callback) {
		this.removeListener("UserLoaded", callback);
	}
},EventEmitter.prototype);

export default Store;