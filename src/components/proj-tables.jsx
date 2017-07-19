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
//{this.props.accts.map(acc => theadElement(acc.addr))}
export default class ProjTable extends React.Component {
	static propTypes = {
		projVals: propTypes.shape({
			projName: propTypes.string,
			totalTixs: propTypes.string,
			consumMaxTixs: propTypes.string,
			promoAddr: propTypes.string,
			addr: propTypes.string,
			state: propTypes.string
		})
	}
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
