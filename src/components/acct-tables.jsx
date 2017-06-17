import React from 'react'
import accTypes from '../prop-types/accts'
function theadElement(element) {
	return <th>{element}</th>
}
function tdElement(element) {
	return <td>{element}</td>
}
//{this.props.accts.map(acc => theadElement(acc.addr))}
export class AcctTableEth extends React.Component {
	render() {
		const thead = (
			<thead>
				<tr>
					{theadElement('Acct addrs')}
					{theadElement('Ether Balance')}
				</tr>
			</thead>
		)
		const tbody = (
			<tbody>
				{this.props.accts.map(addr =>
					<tr key={addr}>
						{tdElement(addr)}
						{tdElement(this.props.acctsByAddr[addr].balance)}
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
AcctTableEth.propTypes = {
	acctsByAddr: accTypes.acctsByAddr,
	accts: accTypes.accts,
}
