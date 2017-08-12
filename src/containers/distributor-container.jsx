import React, { Component } from 'react'
import Layout from '../components/Layout'
import { connect } from 'react-redux'
import propTypes from 'prop-types'
import Projects from './projects-container'
class DistributorContainer extends Component {
	static propTypes = {
		accounts: propTypes.object,
		projects: propTypes.array,
		projectsByAddress: propTypes.object
	}

	render() {
		return (
			<Layout heading="Distributor View">
				<Projects currentUser={'distributor'} />
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
export default connect(mapStateToProps)(DistributorContainer)
