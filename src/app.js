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
import Proj from '../build/contracts/Proj.json'
import ProjResolver from '../build/contracts/ProjResolver.json'
import ReactDOM from 'react-dom'
class App extends Component {
	async componentDidMount() {
		let { web3, provider, contract } = store.getState().web3State

		let currentNetwork = web3.version.network
		console.log('currentnetwork:', currentNetwork)
		const proj = contract(Proj)
		const projResolver = contract(ProjResolver)
		proj.setProvider(provider)
		projResolver.setProvider(provider)
		store.dispatch({ type: { web3Connected: true }, web3, proj, projResolver })
		store.dispatch(actions.projResolverDeploySuccess(await deployProjResolver()))
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
ReactDOM.render(<App />, document.getElementById('root'))
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
