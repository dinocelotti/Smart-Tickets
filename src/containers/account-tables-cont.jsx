import { AccountTableEth } from './../components/account-tables'
import React from 'react'
import { connect } from 'react-redux'
import { getAccounts } from '../actions/account-actions'
import propTypes from 'prop-types'
class AccountTableEthCont extends React.Component {
	componentDidMount() {
		this.props.getAccounts()
	}
	static propTypes = {
		accounts: propTypes.array,
		getAccounts: propTypes.func,
		accountsByAddress: propTypes.object
	}
	render() {
		return (
			<AccountTableEth
				accounts={this.props.accounts}
				accountsByAddress={this.props.accountsByAddress}
			/>
		)
	}
}

function mapEthStateToProps({
	accountState: { byId: accountsByAddress, ids: accounts }
}) {
	return {
		accountsByAddress,
		accounts
	}
}
const mapDispatchToProps = dispatch => ({
	getAccounts: () => dispatch(getAccounts())
})
export const EthTable = connect(mapEthStateToProps, mapDispatchToProps)(
	AccountTableEthCont
)
