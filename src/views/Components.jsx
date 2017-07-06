import React, { Component } from 'react'
import Layout from '../components/Layout'
import { EthTable } from '../containers/acct-tables-cont'
// import PromoSection from '../containers/promo-section-cont'
import ProjTables from '../containers/proj-tables-cont'
import EthApi from '../api/eth-api'
export default class Components extends Component {
	async componentWillMount() {
		let ethApi = new EthApi()
		await ethApi.loadContracts()
		await ethApi.deployContract({
			_contract: EthApi.projResolver,
			name: 'projResolver'
		})
	}

	render() {
		return (
			<Layout>
				<h1>Components</h1>
				<EthTable />
				{/* <PromoSection /> */}
				<ProjTables />
			</Layout>
		)
	}
}
