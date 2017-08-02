import React from 'react'
import propTypes from 'prop-types'
function theadElement(element) {
	return (
		<th>
			{element}
		</th>
	)
}
function tdElement(element) {
	return (
		<td>
			{element}
		</td>
	)
}
//{this.props.accounts.map(acc => theadElement(acc.address))}
export class AccountTableEth extends React.Component {
	static propTypes = {
		accounts: propTypes.array,
		accountsByAddress: propTypes.object
	}
	render() {
		const thead = (
			<thead>
				<tr>
					{theadElement('Account addresss')}
					{theadElement('Ether Balance')}
				</tr>
			</thead>
		)
		const tbody = (
			<tbody>
				{this.props.accounts.map(address =>
					<tr key={address}>
						{tdElement(address)}
						{tdElement(this.props.accountsByAddress[address].balance)}
					</tr>
				)}
			</tbody>
		)
		return (
			<table className="pure-table">
				{thead}
				{tbody}
			</table>
		)
	}
}
