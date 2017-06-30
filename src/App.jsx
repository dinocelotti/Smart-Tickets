import React, { Component } from 'react'
import { connect } from 'react-redux'
import { deployProjResolver } from './api/proj-api'
import store from './store'
import * as actions from './actions/proj-actions'
import PT from 'prop-types'
import './css/reset.css'
import './css/fonts.css'
import './css/app.css'
import SideNav from './components/side-nav'

class App extends Component {
	async componentDidMount() {
		store.dispatch(
			actions.projResolverDeploySuccess(await deployProjResolver())
		)
	}
	render() {
		if (this.props.projResolver.deployed) {
			return <SideNav />
		}
		// return null
		// TODO: Fix projResolver issue, until then, return SideNav
		return <SideNav />
	}
}

App.propTypes = {
	projResolver: PT.shape({
		deployed: PT.bool.isRequired,
	}).isRequired,
}

function mapStateToProps(state) {
	return {
		projResolver: state.projState.projResolver,
	}
}

export default connect(mapStateToProps)(App)
