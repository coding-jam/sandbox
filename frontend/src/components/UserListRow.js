import React from "react";

export default class UserListRow extends React.Component {
	constructor(props) {
		super(props);
	}

	renderLanguages(languages) {
		if(!languages || !languages.length){
			return "";
		}

		return languages.map((l,i) => {
			return <li key={i}>{l}</li>
		});
	}

	render() {

		return (
			<tr key={this.props.user.id}>
				<td className="avatarRow">
					<a href={this.props.user.html_url} target="_blank">
						<img className="img-responsive" src={this.props.user.avatar_url}>
						</img>
					</a>
				</td>
				<td>
					<dl>
						<dt>
							<a href={this.props.user.html_url} target="_blank">
								<h3 className="NoPadding">{this.props.user.login}</h3>
							</a>
						</dt>
						<dd className={this.props.user.name ? 'show' : 'hidden'}>
							{this.props.user.name}
						</dd>
						<dd className={this.props.user.blog ? 'show' : 'hidden'}>
							<a target="_blank" href={this.props.user.blog}>{this.props.user.blog}</a>
						</dd>
						<dd className={this.props.user.languages.length ? 'show' : 'hidden'}>
							<ul className="list-inline">
								{this.renderLanguages(this.props.user.languages)}
							</ul>
						</dd>
						<dd className={this.props.user.location ? 'show' : 'hidden'}>
							<i>{this.props.user.location}</i>
						</dd>
					</dl>
				</td>
			</tr>
		);
	}
}