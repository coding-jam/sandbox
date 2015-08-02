import Dispatcher from "src/Dispatcher";
import jQuery from "jquery";

var caricaListaRegioni = function() {
	Dispatcher.dispatch({
		actionType: "loadingListaRegioni"
	});

	jQuery.get('/api/v1/users').then(function(response){
		Dispatcher.dispatch({
			actionType: "listaRegioniLoaded",
			locations:response.locations
		});
	})
};

export default {
	caricaListaRegioni: caricaListaRegioni
};