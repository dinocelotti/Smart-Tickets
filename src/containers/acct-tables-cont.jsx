import { AcctTableEth } from './../components/acct-tables'
import React from 'react'
import { connect } from 'react-redux'
import * as acctApi from '../api/acct-api'
import accTypes from '../prop-types/accts'
import store from '../store'
import { getAccts } from '../actions/acct-actions'

class AcctTableEthCont extends React.Component {
	componentDidMount() {
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
	getAccts: () => dispatch(getAccts())
})
export const EthTable = connect(mapEthStateToProps, mapDispatchToProps)(
	AcctTableEthCont
)
