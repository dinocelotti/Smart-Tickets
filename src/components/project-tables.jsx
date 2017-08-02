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
export default class ProjectTable extends React.Component {
	static propTypes = {
		projectVals: propTypes.shape({
			projectName: propTypes.string,
			totalTickets: propTypes.string,
			consumerMaxTickets: propTypes.string,
			promoter: propTypes.string,
			address: propTypes.string,
			state: propTypes.string
		})
	}
	render() {
		const thead = (
			<thead>
				<tr>
					{theadElement('Project Name')}
					{theadElement('Max Tickets')}
					{theadElement('Max Transfers')}
					{theadElement('Promoter Address')}
					{theadElement('Contract Address')}
					{theadElement('State')}
				</tr>
			</thead>
		)
		const tbody = (
			<tbody>
				<tr>
					{tdElement(this.props.projectVals.projectName)}
					{tdElement(this.props.projectVals.totalTickets)}
					{tdElement(this.props.projectVals.consumerMaxTickets)}
					{tdElement(this.props.projectVals.promoter)}
					{tdElement(this.props.projectVals.address)}
					{tdElement(this.props.projectVals.state)}
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
