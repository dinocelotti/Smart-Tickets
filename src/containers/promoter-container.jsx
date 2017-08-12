import React, { Component } from 'react'
import Layout from '../components/Layout'
import { connect } from 'react-redux'
import propTypes from 'prop-types'
import Promoter from '../components/promoter/promoter'
import Projects from './projects-container'
class PromoterContainer extends Component {
	static propTypes = {
		accounts: propTypes.object,
		projects: propTypes.array,
		projectsByAddress: propTypes.object
	}

	render() {
		return (
			<Layout heading="Promoter View">
				<Promoter accounts={this.props.accounts} />
				<Projects currentUser={'promoter'} />
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
export default connect(mapStateToProps)(PromoterContainer)
