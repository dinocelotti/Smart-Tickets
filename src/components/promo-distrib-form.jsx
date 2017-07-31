import React, { Component } from 'react'
import propTypes from 'prop-types'
export default class PromoDistribForm extends Component {
	static propTypes = {
		createDistrib: propTypes.func,
		setDistribVals: propTypes.func
	}
	render() {
		return (
			<form
				className="pure-form pure-form-stacked"
				onSubmit={this.props.createDistrib}
			>
				<fieldset className="pure-group pure-u-3-4">
					<legend> Form for setting allotted quantity for a distributor</legend>

					<label htmlFor="distribAddr"> Distributor Buyer Address</label>
					<input
						type="text"
						id="distribAddr"
						onChange={this.props.setDistribVals('distribAddr')}
						className="pure-input-1"
						placeholder="Buyer addr"
					/>
					<label htmlFor="distribAllotQuan">
						{' '}Set Allotted Quantity of Tickets for Distributor{' '}
					</label>
					<input
						type="text"
						id="distribAllotQuan"
						onChange={this.props.setDistribVals('distribAllotQuan')}
						className="pure-input-1"
						placeholder="Allotted Quantities"
					/>
					<label htmlFor="tixType"> Ticket Type</label>
					<input
						type="text"
						id="tixType"
						className="pure-input-1"
						onChange={this.props.setDistribVals('tixType')}
						placeholder="Ticket Type"
					/>
					<label htmlFor="promoFee"> Set Promoters Fee for Distributor </label>
					<input
						type="text"
						id="promoFee"
						onChange={this.props.setDistribVals('promoFee')}
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
