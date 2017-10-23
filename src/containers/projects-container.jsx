import Projects from '../components/projects'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import propTypes from 'prop-types'

class ProjectsContainer extends Component {
	render() {
		return (
			<Projects
				projectState={this.props.projectState}
				accounts={this.props.accounts}
				ticketState={this.props.ticketState}
				distributorState={this.props.distributorState}
				currentUser={this.props.currentUser}
			/>
		)
	}
}

export default connect(
	({
		projectState,
		accountState: accounts,
		ticketState,
		distributorState
	}) => ({
			projectState,
			accounts,
			ticketState,
			distributorState
		})
)(ProjectsContainer)
