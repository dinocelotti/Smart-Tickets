import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'
import history from './util/history'
import Home from './views/Home'
import Components from './views/Components'
import Events from './views/Events'
import * as api from './api/proj-api'
import './styles/reset.css'
import './styles/fonts.css'
import './styles/global.css'
import EthApi from './api/eth-api'
class App extends Component {
	async componentDidMount() {
		let ethApi = new EthApi()
		await ethApi.loadContracts()
		await ethApi.deployContract({
			_contract: EthApi.projResolver,
			name: 'projResolver'
		})
		//start loading state
		api.loadAppState()
	}
	render() {
		if (this.props.projResolver.deployed) {
			console.log(this.props.projResolver, 'rendered')
			return (
				<ConnectedRouter history={history}>
					<div>
						<Route exact path="/" component={Home} />
						<Route path="/events" component={Events} />
						<Route path="/components" component={Components} />
					</div>
				</ConnectedRouter>
			)
		}
		return null
	}
}
function mapStateToProps({ web3State: { projResolver } }) {
	return { projResolver }
}

export default connect(mapStateToProps)(App)
