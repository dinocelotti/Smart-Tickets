import { AcctTableEth } from './../components/acct-tables'
import React from 'react'
import { connect } from 'react-redux'
import * as acctApi from '../api/acct-api'
import accTypes from '../prop-types/accts'
import store from '../store'
import { getAcctsSuccess } from '../actions/acct-actions'

class AcctTableEthCont extends React.Component {
	componentDidMount() {
		//get acct addrs
		acctApi
			.getAcctsAndBals()
			.then(accts => store.dispatch(getAcctsSuccess(accts)))
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

AcctTableEthCont.propTypes = {
	accts: accTypes.accts,
	acctsByAddr: accTypes.acctsByAddr
}

function mapEthStateToProps(store) {
	return {
		acctsByAddr: store.acctState.acctsByAddr,
		accts: store.acctState.accts
	}
}

export const EthTable = connect(mapEthStateToProps, { getAcctsSuccess })(
	AcctTableEthCont
)
