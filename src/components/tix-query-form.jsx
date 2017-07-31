import React, { Component } from 'react'
import propTypes from 'prop-types'
export default class PromoTixForm extends Component {
	static propTypes = {
		queryTix: propTypes.func,
		setTixVals: propTypes.func,
		tixPrice: propTypes.string,
		tixQuantity: propTypes.string
	}
	render() {
		return (
			<form
				className="pure-form pure-form-stacked"
				onSubmit={this.props.queryTix}
			>
				<fieldset className="pure-group pure-u-3-4">
					<legend>
						A form for querying a type of ticket and seeing what the price and
						quantity set on it was{' '}
					</legend>
					<label htmlFor="tixType"> Ticket Type</label>
					<input
						type="text"
						id="tixType"
						className="pure-input-1"
						placeholder="Ticket Type"
						onChange={this.props.setTixVals('tixType')}
					/>
					<label htmlFor="tixPrice"> Ticket Price </label>
					<input
						type="text"
						id="tixPrice"
						className="pure-input-1"
						value={this.props.tixPrice}
						placeholder="Ticket Price"
						readOnly
					/>
					<label htmlFor="tixQuantity"> Ticket Quantity </label>
					<input
						type="text"
						id="tixQuantity"
						className="pure-input-1"
						value={this.props.tixQuantity}
						placeholder="Ticket Quantity"
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
