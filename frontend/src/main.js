import 'bootstrap/css/bootstrap.css!';
import React from "react";
import Map from "src/components/Map";
import SearchForm from "src/components/SearchForm";

export default (function(){
	React.render(
		<div>
			<SearchForm/>
			<Map/>
		</div>,
	document.getElementById('wrapper'));
})();
