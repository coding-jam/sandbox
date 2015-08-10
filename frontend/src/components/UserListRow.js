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
							Username
						</dt>
						<dd>
							{this.props.user.login}
						</dd>
						<dt className={this.props.user.name ? 'show' : 'hidden'}>
							Nome
						</dt>
						<dd className={this.props.user.name ? 'show' : 'hidden'}>
							{this.props.user.name}
						</dd>
						<dt className={this.props.user.blog ? 'show' : 'hidden'}>
							Blog
						</dt>
						<dd className={this.props.user.blog ? 'show' : 'hidden'}>
							<a target="_blank" href={this.props.user.blog}>{this.props.user.blog}</a>
						</dd>
						<dt className={this.props.user.bio ? 'show' : 'hidden'}>
							Bio
						</dt>
						<dd className={this.props.user.bio ? 'show' : 'hidden'}>
							{this.props.user.bio}
						</dd>
						<dt>
							Followers
						</dt>
						<dd>
							{this.props.user.followers}
						</dd>
						<dt>
							Repository
						</dt>
						<dd>
							{this.props.user.public_repos}
						</dd>
						<dt className={this.props.user.languages.length ? 'show' : 'hidden'}>
							Linguaggi
						</dt>
						<dd className={this.props.user.languages.length ? 'show' : 'hidden'}>
							<ul className="list-inline">
								{this.renderLanguages(this.props.user.languages)}
							</ul>
						</dd>
					</dl>
				</td>
			</tr>
		);
	}
}