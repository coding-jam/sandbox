import React from "react";

export default class SearchForm extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="SearchForm">
				<div className="container">
					<div className="row">
						<input 
							placeholder="Inserisci qui la tua ricerca..."
							className="form-control" 
							type="text"></input>
					</div>
				</div>
			</div>
		);
	}
}