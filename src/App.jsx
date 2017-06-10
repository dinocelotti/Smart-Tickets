import React, { Component } from 'react';
import { connect } from 'react-redux';
import { EthTable } from './containers/acct-tables-cont';
import PromoSection from './containers/promo-section-cont';
import ProjTables from './containers/proj-tables-cont';
import { deployProjResolver } from './api/proj-api';
import './css/grids-responsive-min.css';
import './css/oswald.css';
import './css/open-sans.css';
import './css/pure-min.css';
import './App.css';

class App extends Component {
	componentDidMount() {
		deployProjResolver();
	}
	render() {
		if (this.props.projResolverDeployed) {
			return (
				<div className="App ">
					<nav className="navbar pure-menu pure-menu-horizontal">

						<a href="#" className="pure-menu-heading pure-menu-link">
							Membran Smart-Tixs
						</a>
					</nav>
					<main className="cont">
						<div className="pure-g">
							<div className="pure-u-1-1">
								<EthTable />
							</div>
							<div className="pure-u-1-1">
								<PromoSection />
							</div>
							<div className="pure-u-1-1">
								<ProjTables />
							</div>
						</div>
					</main>
				</div>
			);
		} else {
			return null;
		}
	}
}
function mapStateToProps(state) {
	return {
		projResolverDeployed: state.projState.projResolverDeployed
	};
}
export default connect(mapStateToProps)(App);
