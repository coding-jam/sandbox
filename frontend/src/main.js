import 'bootstrap/css/bootstrap.css!';
import 'sweetalert/dist/sweetalert.css!';

import swal from "sweetalert";
import React from "react";
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';
import Reducers from 'src/Reducers';
import App from 'src/components/App';
import Actions from 'src/Actions';

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware, // lets us dispatch() functions
  loggerMiddleware // neat middleware that logs actions
)(createStore);

let store = createStoreWithMiddleware(Reducers);

window.swal = swal;

export default (function(){

	store.dispatch(Actions.loadUserByLanguage());

	React.render(
		<Provider store={store}>{() => <App/>}</Provider>
	,document.getElementById('wrapper'));
})();
