import React, { Component } from 'react'
import Layout from '../components/Layout'
import { EthTable } from '../containers/account-tables-cont'
import PromoterSection from '../containers/promoter-section-cont'
import ProjectTables from '../containers/project-tables-cont'
export default class Components extends Component {
	render() {
		return (
			<Layout>
				<h1>Components</h1>
				<EthTable />
				<PromoterSection />
				<ProjectTables />
			</Layout>
		)
	}
}
