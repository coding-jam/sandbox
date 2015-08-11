import Dispatcher from "src/Dispatcher";
import Events from "events";
import _ from "lodash";

var EventEmitter = Events.EventEmitter;

var count = 0;

Dispatcher.register(function(action) {
	switch (action.actionType) {
		case "loadingStart":
			Store.increment();
			break;
		case "loadingEnd":
			Store.decrement();
			break;
	};
});

var Store = _.extend({
	isLoading:function(){
		return !!count;
	},
	increment: function() {
		var loading = Store.isLoading();
		count++;
		if(loading !== Store.isLoading()){
			this.emit("LoadingChanged");	
		}
	},
	decrement:function(){
		var loading = Store.isLoading();
		count--;
		if(count < 0){
			count = 0;
		}
		if(loading !== Store.isLoading()){
			this.emit("LoadingChanged");	
		}
	},
	addChangeListener: function(callback) {
		this.on("LoadingChanged", callback);
	},
	removeChangeListener: function(callback) {
		this.removeListener("LoadingChanged", callback);
	}
},EventEmitter.prototype);

export default Store;