import React, { Component } from 'react'
import propTypes from 'prop-types'
export default class PromoterTicketForm extends Component {
	static propTypes = {
		createTickets: propTypes.func,
		setTicketVals: propTypes.func,
		ticketsLeft: propTypes.string
	}
	static defaultProps = {
		ticketsLeft: '0'
	}
	render() {
		return (
			<form
				className="pure-form pure-form-stacked"
				onSubmit={this.props.createTickets}
			>
				<fieldset className="pure-group pure-u-3-4">
					<legend>
						{' '}A Form for assigning a ticket type from the pool of unassigned
						tickets, along with its price and quantity
					</legend>
					<label htmlFor="ticketsLeft"> Remaining tickets left </label>
					<input
						type="text"
						id="ticketsLeft"
						className="pure-input-1"
						value={this.props.ticketsLeft}
						readOnly
					/>
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
						placeholder="Ticket Price"
						onChange={this.props.setTicketVals('ticketPrice')}
					/>
					<label htmlFor="ticketQuantity"> Ticket Quantity </label>
					<input
						type="text"
						id="ticketQuantity"
						className="pure-input-1"
						placeholder="Ticket Quantity"
						onChange={this.props.setTicketVals('ticketQuantity')}
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
