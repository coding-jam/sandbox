import React from "react";

export default class UserImage extends React.Component {
	
	render() {
		return (
			<img className="img-responsive" src={this.props.url}></img>
		);
	}
}