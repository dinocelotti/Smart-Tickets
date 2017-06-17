import { AcctTableEth } from './../components/acct-tables';
import React from 'react';
import { connect } from 'react-redux';
import * as acctApi from '../api/acct-api';
import accTypes from '../prop-types/accts';

class AcctTableEthCont extends React.Component {
	componentDidMount() {
		//get acct addrs
		acctApi.getAcctsAndBals();
	}
	render() {
		return <AcctTableEth accts={this.props.accts} acctsByAddr={this.props.acctsByAddr} />;
	}
}

AcctTableEthCont.propTypes = {
	accts: accTypes.accts,
	acctsByAddr: accTypes.acctsByAddr
};

function mapEthStateToProps(store) {
	return {
		acctsByAddr: store.acctState.acctsByAddr,
		accts: store.acctState.accts
	};
}

export const EthTable = connect(mapEthStateToProps)(AcctTableEthCont);
