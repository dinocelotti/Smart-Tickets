import Projects from '../components/projects/projects'
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
				tickets={this.props.tickets}
				distributors={this.props.distributors}
				currentUser={this.props.currentUser}
			/>
		)
	}
}

export default connect(
	({
		projectState: projects,
		accountState: accounts,
		ticketState: tickets,
		distributorState: distributors
	}) => ({
		projects,
		accounts,
		tickets,
		distributors
	})
)(ProjectsContainer)
