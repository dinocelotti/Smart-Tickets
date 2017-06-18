import React, { Component } from 'react'
import { connect } from 'react-redux'
import { deployProjResolver } from './api/proj-api'
import PT from 'prop-types'
import './css/reset.css'
import './App.css'
import SideNav from './components/side-nav'

class App extends Component {
	componentDidMount() {
		deployProjResolver()
	}
	render() {
		if (this.props.projResolverDeployed) {
			return <SideNav />
		}
		return null
	}
}

App.propTypes = {
	projResolverDeployed: PT.bool,
}

function mapStateToProps(state) {
	return {
		projResolverDeployed: state.projState.projResolverDeployed,
	}
}

export default connect(mapStateToProps)(App)
