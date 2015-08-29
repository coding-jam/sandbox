import React from "react";
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
	}

	_search(value){
		return this.props.dispatch(Actions.loadUserByLanguage(value));
	}

	_changeZoom(value){
		this.props.dispatch(Actions.changeZoom(value));
	}

	render() {
	    return (
	    	<div>
	    		<SearchForm search={this.search}/>
				<Loader show={this.props.loadingCount > 0}/>
				<Map 
					changeZoom={this.changeZoom}
					zoom={this.props.zoom} 
					locations={this.props.locations}/>
			</div>
	    );
	}
};

var select = state => state;

export default connect(select)(App);