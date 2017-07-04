import React from 'react'
import Layout from '../components/Layout'
import { EthTable } from '../containers/acct-tables-cont'
// import PromoSection from '../containers/promo-section-cont'
// import ProjTables from '../containers/proj-tables-cont'

const Components = () => {
	return (
		<Layout>
			<h1>Components</h1>
			<EthTable />
			{/* <PromoSection />
			<ProjTables /> */}
		</Layout>
	)
}

export default Components
