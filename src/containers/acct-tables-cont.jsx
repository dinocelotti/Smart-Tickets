import { AcctTableEth } from './../components/acct-tables'
import React from 'react'
import { connect } from 'react-redux'
import { getAccts } from '../actions/acct-actions'
import propTypes from 'prop-types'
class AcctTableEthCont extends React.Component {
	componentDidMount() {
		this.props.getAccts()
	}
	static propTypes = {
		accts: propTypes.array,
		getAccts: propTypes.func,
		acctsByAddr: propTypes.object
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
