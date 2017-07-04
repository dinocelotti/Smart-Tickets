import React, { Component } from 'react'
import { connect } from 'react-redux'
import { deployProjResolver } from './api/proj-api'
import { Provider } from 'react-redux'
import { Route } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'
import store from './store'
import * as actions from './actions/proj-actions'
import history from './util/history'
import Home from './views/Home'
import Components from './views/Components'
import Events from './views/Events'
import PT from 'prop-types'
import './styles/reset.css'
import './styles/fonts.css'
import './styles/global.css'

class App extends Component {
	async componentDidMount() {
		store.dispatch(
			actions.projResolverDeploySuccess(await deployProjResolver())
		)
	}
	render() {
		// TODO: Fix projResolver issue, until then, return SideNav
		// if (this.props.projResolver.deployed) {
		// 	return <SideNav />
		// }
		// return null
		return (
			<Provider store={store}>
				<ConnectedRouter history={history}>
					<div>
						<Route exact path="/" component={Home} />
						<Route path="/events" component={Events} />
						<Route path="/components" component={Components} />
					</div>
				</ConnectedRouter>
			</Provider>
		)
	}
}

App.propTypes = {
	projResolver: PT.shape({
		deployed: PT.bool.isRequired
	}).isRequired
}

function mapStateToProps(state) {
	return {
		projResolver: state.projState.projResolver
	}
}

export default connect(mapStateToProps)(App)
