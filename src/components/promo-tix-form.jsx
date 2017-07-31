import React, { Component } from 'react'
import propTypes from 'prop-types'
export default class PromoTixForm extends Component {
	static propTypes = {
		createTixs: propTypes.func,
		setTixVals: propTypes.func,
		tixsLeft: propTypes.string
	}
	static defaultProps = {
		tixsLeft: '0'
	}
	render() {
		return (
			<form
				className="pure-form pure-form-stacked"
				onSubmit={this.props.createTixs}
			>
				<fieldset className="pure-group pure-u-3-4">
					<legend>
						{' '}A Form for assigning a ticket type from the pool of unassigned
						tickets, along with its price and quantity
					</legend>
					<label htmlFor="tixsLeft"> Remaining tickets left </label>
					<input
						type="text"
						id="tixsLeft"
						className="pure-input-1"
						value={this.props.tixsLeft}
						readOnly
					/>
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
						placeholder="Ticket Price"
						onChange={this.props.setTixVals('tixPrice')}
					/>
					<label htmlFor="tixQuantity"> Ticket Quantity </label>
					<input
						type="text"
						id="tixQuantity"
						className="pure-input-1"
						placeholder="Ticket Quantity"
						onChange={this.props.setTixVals('tixQuantity')}
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
