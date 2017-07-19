import React from 'react'
import projTypes from '../prop-types/projs'

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
//{this.props.accts.map(acc => theadElement(acc.addr))}
export default class ProjTable extends React.Component {
	render() {
		const thead = (
			<thead>
				<tr>
					{theadElement('Proj Name')}
					{theadElement('Max Tixs')}
					{theadElement('Max Transfers')}
					{theadElement('Promo Addr')}
					{theadElement('Contract Addr')}
					{theadElement('State')}
				</tr>
			</thead>
		)
		const tbody = (
			<tbody>
				<tr>
					{tdElement(this.props.projVals.projName)}
					{tdElement(this.props.projVals.totalTixs)}
					{tdElement(this.props.projVals.consumMaxTixs)}
					{tdElement(this.props.projVals.promoAddr)}
					{tdElement(this.props.projVals.addr)}
					{tdElement(this.props.projVals.state)}
				</tr>
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
