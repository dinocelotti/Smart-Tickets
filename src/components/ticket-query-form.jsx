import React, { Component } from 'react'
import propTypes from 'prop-types'
export default class PromoterTicketForm extends Component {
	static propTypes = {
		queryTicket: propTypes.func,
		setTicketVals: propTypes.func,
		ticketPrice: propTypes.string,
		ticketQuantity: propTypes.string
	}
	render() {
		return (
			<form
				className="pure-form pure-form-stacked"
				onSubmit={this.props.queryTicket}
			>
				<fieldset className="pure-group pure-u-3-4">
					<legend>
						A form for querying a type of ticket and seeing what the price and
						quantity set on it was{' '}
					</legend>
					<label htmlFor="ticketType"> Ticket Type</label>
					<input
						type="text"
						id="ticketType"
						className="pure-input-1"
						placeholder="Ticket Type"
						onChange={this.props.setTicketVals('ticketType')}
					/>
					<label htmlFor="ticketPrice"> Ticket Price </label>
					<input
						type="text"
						id="ticketPrice"
						className="pure-input-1"
						value={this.props.ticketPrice}
						placeholder="Ticket Price"
						readOnly
					/>
					<label htmlFor="ticketQuantity"> Ticket Quantity </label>
					<input
						type="text"
						id="ticketQuantity"
						className="pure-input-1"
						value={this.props.ticketQuantity}
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
