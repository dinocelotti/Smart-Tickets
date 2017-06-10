import { AcctTableEth } from './../views/acct-tables';
import React from 'react';
import { connect } from 'react-redux';
import * as acctApi from '../api/acct-api';

class AcctTableEthCont extends React.Component {
	componentDidMount() {
		//get acct addrs
		acctApi.getAcctsAndBals();
	}
	render() {
		return <AcctTableEth accts={this.props.accts} />;
	}
}
function mapEthStateToProps(store) {
	return {
		accts: store.acctState.accts
	};
}

export const EthTable = connect(mapEthStateToProps)(AcctTableEthCont);
