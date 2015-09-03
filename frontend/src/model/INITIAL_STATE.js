const INITIAL_STATE = {
	map:{
		markers:[],
		viewportData:{
			zoom:4,
			bounds:null,
			center:null
		}	
	},
	location:{
		country:null,
		district:null
	},
	users:{
		lastQuery:null,
		results:[],
		showModal:false
	},
	loading:{
		count:0
	}
};

export default INITIAL_STATE;