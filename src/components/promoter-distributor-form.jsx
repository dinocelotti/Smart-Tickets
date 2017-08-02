import React, { Component } from 'react'
import propTypes from 'prop-types'
export default class PromoterDistributorForm extends Component {
	static propTypes = {
		createDistributor: propTypes.func,
		setDistributorVals: propTypes.func
	}
	render() {
		return (
			<form
				className="pure-form pure-form-stacked"
				onSubmit={this.props.createDistributor}
			>
				<fieldset className="pure-group pure-u-3-4">
					<legend> Form for setting allotted quantity for a distributor</legend>

					<label htmlFor="distributorAddress"> Distributor Buyer Address</label>
					<input
						type="text"
						id="distributorAddress"
						onChange={this.props.setDistributorVals('distributorAddress')}
						className="pure-input-1"
						placeholder="Buyer address"
					/>
					<label htmlFor="distributorAllottedQuantity">
						{' '}Set Allotted Quantity of Tickets for Distributor{' '}
					</label>
					<input
						type="text"
						id="distributorAllottedQuantity"
						onChange={this.props.setDistributorVals(
							'distributorAllottedQuantity'
						)}
						className="pure-input-1"
						placeholder="Allotted Quantities"
					/>
					<label htmlFor="ticketType"> Ticket Type</label>
					<input
						type="text"
						id="ticketType"
						className="pure-input-1"
						onChange={this.props.setDistributorVals('ticketType')}
						placeholder="Ticket Type"
					/>
					<label htmlFor="promoterFee">
						{' '}Set Promoters Fee for Distributor{' '}
					</label>
					<input
						type="text"
						id="promoterFee"
						onChange={this.props.setDistributorVals('promoterFee')}
						className="pure-input-1"
						placeholder="Fee in Percent"
					/>
					<br />
					<button type="submit" className="pure-button pure-button-primary">
						{' '}Submit{' '}
					</button>
				</fieldset>
			</form>
		)
	}
}
