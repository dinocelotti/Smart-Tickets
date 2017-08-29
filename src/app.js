import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'
import history from './util/history'
import Promoter from './containers/promoter-container'
import Distributor from './containers/distributor-container'
import EndConsumer from './containers/end-consumer-container'
import ethApi from './api/eth-api'
import store from './store'
import { getAccounts } from './actions/account-actions'
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
		projectResolver: propTypes.shape({ deployed: propTypes.bool })
	}
	componentDidMount() {
		this.load()
	}
	async load() {
		//TODO: duplicate loading here... due to the WW not sharing the same functions/objects as the bundle
		await ethApi.loadContracts()
		await ethApi.deployContract({
			_contract: ethApi.projectResolver,
			name: 'projectResolver'
		})
		//get accounts
		this.props.getAccounts()
		//start loading state
		const worker = new myWorker()
		worker.onmessage = e => {
			//console.groupCollapsed('app WW message')
			console.log(e.data)
			//console.groupEnd()
			store.dispatch(e.data)
		}
	}
	render() {
		if (this.props.projectResolver.deployed) {
			return (
				<div>
					<link
						rel="stylesheet"
						href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.11/semantic.min.css"
					/>
					<ConnectedRouter history={history}>
						<div>
							<Route exact path="/" component={Promoter} />
							<Route path="/distributor" component={Distributor} />
							<Route path="/endconsumer" component={EndConsumer} />
						</div>
					</ConnectedRouter>
				</div>
			)
		}
		return null
	}
}
function mapStateToProps({ web3State: { projectResolver } }) {
	return { projectResolver }
}
const mapDispatchToProps = dispatch => ({
	getAccounts: () => dispatch(getAccounts())
})

export default connect(mapStateToProps, mapDispatchToProps)(App)
