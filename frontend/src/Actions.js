import Dispatcher from "src/Dispatcher";
import Locations from "src/model/Locations";

var loadRegionList = function() {
	Dispatcher.dispatch({
		actionType: "loadingStart"
	});

	Locations.listRegions().then(function(regions){
		Dispatcher.dispatch({
			actionType: "loadingEnd"
		});

		Dispatcher.dispatch({
			actionType: "regionsLoaded",
			regions:regions
		});
	})
};

export default {
	loadRegionList: loadRegionList
};