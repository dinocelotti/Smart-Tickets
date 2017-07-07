import { AcctTableEth } from './../components/acct-tables'
import React from 'react'
import { connect } from 'react-redux'
import * as acctApi from '../api/acct-api'
import accTypes from '../prop-types/accts'
import store from '../store'
import { getAcctsSuccess } from '../actions/acct-actions'

class AcctTableEthCont extends React.Component {
	componentDidMount() {
		console.log('getAcctsCalled')
		this.props.getAccts()
	}
	render() {
		return (
			<AcctTableEth
				accts={this.props.accts}
				acctsByAddr={this.props.acctsByAddr}
			/>
		)
	}
}

function mapEthStateToProps({ acctState: { byId: acctsByAddr, ids: accts } }) {
	return {
		acctsByAddr,
		accts
	}
}
const mapDispatchToProps = dispatch => ({
	getAccts: dispatch.bind(null, getAcctsSuccess())
})
export const EthTable = connect(mapEthStateToProps, mapDispatchToProps)(
	AcctTableEthCont
)
