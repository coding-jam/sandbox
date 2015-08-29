import _ from "lodash";

const initialState = {
	loadingCount:0,
	lastQuery:null,
	markers:[],
	usersData:{},
	showUserModal:false,
	zoom:6
};

function startLoading(state){
	return Object.assign({},state,{
		loadingCount:state.loadingCount + 1
	});
};

function endLoading(state){
	return Object.assign({},state,{
		loadingCount:state.loadingCount > 0 ? state.loadingCount - 1 : 0
	});
};

function userByLocationLoaded(state,action){
	var toReturn = Object.assign({},state,{
		usersData:Object.assign({},_.omit(action,'actionType')),
		showUserModal:true
	});

	return endLoading(toReturn);
};

function changeZoom(state,action){
	return Object.assign({},state,{
		zoom:action.zoom
	});
};

function closeUserDialog(state){
	return Object.assign({},state,{
		showUserModal:false
	});	
}

var markersLoaded = (state,action) => {
	var toReturn = Object.assign({},state,{
		lastQuery:action.query,
		markers:[...action.markers]
	});

	return endLoading(toReturn);
};

export default function(state = initialState, action) {
	switch (action.actionType) {
		case "loadingStart":
			return startLoading(state);
		case "loadingEnd":
			return endLoading(state);
		case "userByLocationLoaded":
			return userByLocationLoaded(state,action);
		case "zoomChange":
			return changeZoom(state,action);
		case "closeUserDialog":
			return closeUserDialog(state,action);
		case "markersLoaded":
			return markersLoaded(state,action);
		default:
			return state;
	};
}