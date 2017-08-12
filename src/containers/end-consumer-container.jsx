import React, { Component } from 'react'
import Layout from '../components/Layout'
import { connect } from 'react-redux'
import propTypes from 'prop-types'
import Projects from './projects-container'
class EndConsumerContainer extends Component {
	static propTypes = {
		accounts: propTypes.object,
		projects: propTypes.array,
		projectsByAddress: propTypes.object
	}

	render() {
		return (
			<Layout heading="End Consumer View">
				<Projects currentUser={'endConsumer'} />
			</Layout>
		)
	}
}

function mapStateToProps({ projectState, accountState }) {
	return {
		projects: projectState.ids,
		projectsByAddress: projectState.byId,
		accounts: accountState
	}
}
export default connect(mapStateToProps)(EndConsumerContainer)
