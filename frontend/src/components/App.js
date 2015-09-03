import React from "react";
import UserList from "src/components/UserList";
import SearchForm from "src/components/SearchForm";
import Loader from "src/components/Loader";
import Map from 'src/components/Map';
import { connect } from 'react-redux';
import Actions from "src/Actions";

class App extends React.Component{

	constructor(props) {
		super(props);
		this.search = this._search.bind(this);
		this.changeZoom = this._changeZoom.bind(this);
		this.markerClick = this._markerClick.bind(this);
		this.closeModal = this._closeModal.bind(this);
	}

	_search(value){
		return this.props.dispatch(Actions.loadMarkers(this.props.location.country,value));
	}

	_changeZoom(newZoom){
		if(this.props.zoom > newZoom){
			this.props.dispatch(Actions.loadMarkers(null,this.props.users.lastQuery));
		}

		this.props.dispatch(Actions.changeZoom(newZoom));
	}

	_markerClick(location){
		if(this.props.location.country){
			this.props.dispatch(Actions.getUsersByDistrict({
				country:this.props.location.country,
				district:location,
				language:this.props.users.lastQuery
			}));
		}else{
			return this.props.dispatch(Actions.loadMarkers(location,this.props.users.lastQuery));	
		}
	}

	_closeModal(){
		this.props.dispatch(Actions.closeUserDialog());
	}

	componentDidMount(){
		this.props.dispatch(Actions.loadMarkers());
	}

	render() {
	    return (
	    	<div>
	    		<SearchForm 
	    			search={this.search}/>
				<Loader 
					show={this.props.loading.count > 0}/>
				<Map
					markerClick={this.markerClick} 
					changeZoom={this.changeZoom}
					zoom={this.props.map.viewportData.zoom} 
					markers={this.props.map.markers}/>
				<UserList 
					initialQuery={this.props.users.lastQuery}
					closeModal={this.closeModal}
					showModal={this.props.users.showUserModal}
					users={this.props.users.results}
					location={this.props.location.district}/>
			</div>
	    );
	}
};

var select = state => state;

export default connect(select)(App);