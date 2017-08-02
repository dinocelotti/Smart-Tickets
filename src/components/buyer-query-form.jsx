import React, { Component } from 'react'
import propTypes from 'prop-types'
export default class BuyerQueryForm extends Component {
	static propTypes = {
		queryBuyer: propTypes.func,
		setBuyerVals: propTypes.func,
		distributorFee: propTypes.string,
		promoterFee: propTypes.string,
		distributorAllottedQuantity: propTypes.string,
		isDistributor: propTypes.string
	}

	render() {
		return (
			<form
				className="pure-form pure-form-stacked"
				onSubmit={this.props.queryBuyer}
			>
				<fieldset className="pure-group pure-u-3-4">
					<legend>
						A form for querying the status of a buyer for a specific ticket
						type, including if they are a distributor, and if so what attributes
						have been set on their profile
					</legend>
					<label htmlFor="ticketType"> Ticket Type</label>
					<input
						type="text"
						id="ticketType"
						className="pure-input-1"
						onChange={this.props.setBuyerVals('ticketType')}
					/>
					<label htmlFor="buyerAddress"> Buyer Address </label>
					<input
						type="text"
						id="buyerAddress"
						className="pure-input-1"
						onChange={this.props.setBuyerVals('buyerAddress')}
					/>
					<label htmlFor="isDistributor"> Buyer is Distributor </label>
					<input
						type="text"
						id="isDistributor"
						className="pure-input-1"
						value={this.props.isDistributor}
						readOnly
					/>
					<label htmlFor="distributorFee"> Distributor Fee </label>
					<input
						type="text"
						id="distributorFee"
						className="pure-input-1"
						value={this.props.distributorFee}
						readOnly
					/>
					<label htmlFor="promoterFee"> Promoter Fee </label>
					<input
						type="text"
						id="promoterFee"
						className="pure-input-1"
						value={this.props.promoterFee}
						readOnly
					/>
					<label htmlFor="distributorAllottedQuantity">
						{' '}Allotted Quantity{' '}
					</label>
					<input
						type="text"
						id="distributorAllottedQuantity"
						className="pure-input-1"
						value={this.props.distributorAllottedQuantity}
						readOnly
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
