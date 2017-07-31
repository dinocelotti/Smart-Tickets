import React, { Component } from 'react'
import propTypes from 'prop-types'
export default class BuyerQueryForm extends Component {
	static propTypes = {
		queryBuyer: propTypes.func,
		setBuyerVals: propTypes.func,
		distribFee: propTypes.string,
		promoFee: propTypes.string,
		distribAllotQuan: propTypes.string,
		isDistrib: propTypes.string
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
					<label htmlFor="tixType"> Ticket Type</label>
					<input
						type="text"
						id="tixType"
						className="pure-input-1"
						onChange={this.props.setBuyerVals('tixType')}
					/>
					<label htmlFor="buyerAddr"> Buyer Address </label>
					<input
						type="text"
						id="buyerAddr"
						className="pure-input-1"
						onChange={this.props.setBuyerVals('buyerAddr')}
					/>
					<label htmlFor="isDistrib"> Buyer is Distributor </label>
					<input
						type="text"
						id="isDistrib"
						className="pure-input-1"
						value={this.props.isDistrib}
						readOnly
					/>
					<label htmlFor="distribFee"> Distributor Fee </label>
					<input
						type="text"
						id="distribFee"
						className="pure-input-1"
						value={this.props.distribFee}
						readOnly
					/>
					<label htmlFor="promoFee"> Promoter Fee </label>
					<input
						type="text"
						id="promoFee"
						className="pure-input-1"
						value={this.props.promoFee}
						readOnly
					/>
					<label htmlFor="distribAllotQuan"> Allotted Quantity </label>
					<input
						type="text"
						id="distribAllotQuan"
						className="pure-input-1"
						value={this.props.distribAllotQuan}
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
