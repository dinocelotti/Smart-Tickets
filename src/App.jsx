import React, { Component } from 'react'
import { connect } from 'react-redux'
import { deployProjResolver } from './api/proj-api'
import PT from 'prop-types'
import './css/grids-responsive-min.css'
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'
import Sidenav from './components/side-nav'

class App extends Component {
	componentDidMount() {
		deployProjResolver()
	}
	render() {
		if (this.props.projResolverDeployed) {
			return <Sidenav />
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
