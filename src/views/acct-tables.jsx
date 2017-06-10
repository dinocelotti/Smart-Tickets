import React from 'react';

function theadElement(element) {
	return <th>{element}</th>;
}
function tdElement(element) {
	return <td>{element}</td>;
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
		);
		const tbody = (
			<tbody>
				{this.props.accts.map(acc =>
					<tr key={acc.addr}>
						{tdElement(acc.addr)}
						{tdElement(acc.ethBalance)}
					</tr>
				)}

			</tbody>
		);
		return (
			<table className="pure-table">
				{thead}
				{tbody}
			</table>
		);
	}
}
