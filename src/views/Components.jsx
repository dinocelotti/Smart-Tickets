import React, { Component } from 'react'
import Layout from '../components/Layout'
import { EthTable } from '../containers/acct-tables-cont'
import PromoSection from '../containers/promo-section-cont'
import ProjTables from '../containers/proj-tables-cont'
export default class Components extends Component {
	render() {
		return (
			<Layout>
				<h1>Components</h1>
				<EthTable />
				<PromoSection />
				<ProjTables />
			</Layout>
		)
	}
}
