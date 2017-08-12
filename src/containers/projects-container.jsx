import Projects from './../components/projects'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import propTypes from 'prop-types'

class ProjectsContainer extends Component {
	static propTypes = {
		projectState: propTypes.object
	}
	render() {
		return (
			<Projects
				projects={this.props.projects}
				accounts={this.props.accounts}
				currentUser={this.props.currentUser}
			/>
		)
	}
}

export default connect(
	({ projectState: projects, accountState: accounts }) => ({
		projects,
		accounts
	})
)(ProjectsContainer)
