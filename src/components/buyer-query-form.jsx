import React, { Component } from 'react'
import PT from 'prop-types'

export default class BuyerQueryForm extends Component {
	render() {
		return (
			<form
				className="pure-form pure-form-stacked"
				onSubmit={this.props.queryBuyer}
			>
				<fieldset className="pure-group">
					<label htmlFor="tixType"> Tix Type</label>
					<input
						type="text"
						id="tixType"
						className="pure-input-3-4"
						onChange={this.props.setBuyerVals.bind(this, 'tixType')}
					/>
					<label htmlFor="buyerAddr"> Buyer Addr </label>
					<input
						type="text"
						id="buyerAddr"
						className="pure-input-3-4"
						onChange={this.props.setBuyerVals.bind(this, 'buyerAddr')}
					/>
					<label htmlFor="distribFee"> Distrib Fee </label>
					<input
						type="text"
						id="distribFee"
						className="pure-input-3-4"
						value={this.props.distribFee}
						readOnly
					/>
					<label htmlFor="promoFee"> Promo Fee </label>
					<input
						type="text"
						id="promoFee"
						className="pure-input-3-4"
						value={this.props.promoFee}
						readOnly
					/>
					<label htmlFor="distribAllotQuan"> Allotted Quantity </label>
					<input
						type="text"
						id="distribAllotQuan"
						className="pure-input-3-4"
						value={this.props.distribAllotQuan}
						readOnly
					/>
					<label htmlFor="isDistrib"> Buyer is Distrib </label>
					<input
						type="text"
						id="isDistrib"
						className="pure-input-3-4"
						value={this.props.isDistrib}
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
