import 'bootstrap/css/bootstrap.css!';
import 'sweetalert/dist/sweetalert.css!';
import React from "react";
import Dispatcher from "src/Dispatcher";
import Map from "src/components/Map";
import UserList from "src/components/UserList";
import SearchForm from "src/components/SearchForm";
import swal from "sweetalert";

Dispatcher.register(function(action) {
	if(window.ENV != 'PROD'){
		console.log(action);	
	}
});

window.swal = swal;

export default (function(){
	React.render(
		<div>
			<SearchForm/>
			<Map/>
			<UserList/>
		</div>,
	document.getElementById('wrapper'));
})();
