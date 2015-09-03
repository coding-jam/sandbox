import INITIAL_STATE from "src/model/INITIAL_STATE";

var loadingStart= (state) => {
	return Object.assign({},state,{
		loading:{
			count:state.loading.count + 1
		}
	});
};

var loadingEnd = (state) => {
	var count = state.loadingCount > 0 ? state.loadingCount - 1 : 0;
	return Object.assign({},state,{
		loading:{
			count:count
		}
	});
};

var userByLocationLoaded = (state,action) => {

	var users = Object.assign({},state.users,{
		results:[...action.users],
		showUserModal:true
	});

	var location = Object.assign({},state.location,{
		district:action.district
	});

	var toReturn = Object.assign({},state,{
		users:users,
		location:location
	});

	return loadingEnd(toReturn);
};

var zoomChange = (state,action) => {

	var map = {...state.map};
	var viewportData = {...map.viewportData};

	viewportData.zoom = action.zoom;

	map.viewportData = viewportData;

	return Object.assign({},state,{
		map:map
	});
};

var closeUserDialog = (state) => {

	var users = Object.assign({},state.users,{
		results:[],
		showUserModal:false
	});

	var location = Object.assign({},state.location,{
		district:null
	});

	return Object.assign({},state,{
		users:users,
		location:location
	});
}

var markersLoaded = (state,action) => {

	var users = Object.assign({},state.users,{
		lastQuery:action.query
	});

	var location = Object.assign({},state.location,{
		country:action.country,
		district:null
	});

	var map = {...state.map,...{
		markers:[...action.markers]
	}};

	var toReturn = Object.assign({},state,{
		users:users,
		location:location,
		map:map
	});

	return loadingEnd(toReturn);
};

var reducers = {
	loadingStart:loadingStart,
	loadingEnd:loadingEnd,
	userByLocationLoaded:userByLocationLoaded,
	zoomChange:zoomChange,
	closeUserDialog:closeUserDialog,
	markersLoaded:markersLoaded
};

export default function(state = INITIAL_STATE, action) {

	var reducer = reducers[action.actionType] || ((state) => {return state});

	return reducer(state,action);
}