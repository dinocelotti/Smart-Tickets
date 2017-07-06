import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Provider } from 'react-redux'
import { Route } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'
import store from './store'
import history from './util/history'
import Home from './views/Home'
import Components from './views/Components'
import Events from './views/Events'
import PT from 'prop-types'
import './styles/reset.css'
import './styles/fonts.css'
import './styles/global.css'
import ReactDOM from 'react-dom'
import EthApi from './api/eth-api'
class App extends Component {
	async componentDidMount() {
		let ethApi = new EthApi()
		await ethApi.loadContracts()
		await ethApi.deployContract({
			_contract: EthApi.projResolver,
			name: 'projResolver'
		})
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

export default connect()(App)
