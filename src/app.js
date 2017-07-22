import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'
import history from './util/history'
import Home from './views/Home'
import Components from './views/Components'
import Events from './views/Events'
import * as api from './api/proj-api'
import EthApi from './api/eth-api'
import store from './store'
//eslint-disable-next-line
const myWorker = require('worker-loader?inline&fallback=false!./api/loadAppState.js')
import propTypes from 'prop-types'
import './styles/reset.css'
import './styles/fonts.css'
import './styles/global.css'
import '!style!css!./styles/grids-responsive-min.css'
import '!style!css!./styles/pure-min.css'

class App extends Component {
	static propTypes = {
		projResolver: propTypes.shape({ deployed: propTypes.bool })
	}
	componentDidMount() {
		this.load()
	}
	async load() {
		//TODO: duplicate loading here... due to the WW not sharing the same functions/objects as the bundle
		const ethApi = new EthApi()
		await ethApi.loadContracts()
		await ethApi.deployContract({
			_contract: EthApi.projResolver,
			name: 'projResolver'
		})
		//start loading state
		const worker = new myWorker()
		worker.onmessage = e => {
			console.log(e.data)
			store.dispatch(e.data)
		}
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
