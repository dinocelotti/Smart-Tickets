import React, { Component } from "react";

export default class PromoterTicketForm extends Component {
  render() {
    return (
      <form
        className="pure-form pure-form-stacked"
        onSubmit={this.props.createTickets}
      >
        <fieldset className="pure-group">
          <label htmlFor="ticketsLeft"> Remaining tickets left </label>
          <input
            type="text"
            id="ticketsLeft"
            className="pure-input-3-4"
            value={this.props.ticketsLeft}
            readOnly
          />
          <label htmlFor="ticketType"> Ticket Type</label>
          <input
            type="text"
            id="ticketType"
            className="pure-input-3-4"
            onChange={this.props.setTicketDetails.bind(this, "ticketType")}
          />
          <label htmlFor="ticketPrice"> Ticket Price </label>
          <input
            type="text"
            id="ticketPrice"
            className="pure-input-3-4"
            onChange={this.props.setTicketDetails.bind(this, "ticketPrice")}
          />
          <label htmlFor="ticketQuantity"> Ticket Quantity </label>
          <input
            type="text"
            id="ticketQuantity"
            className="pure-input-3-4"
            onChange={this.props.setTicketDetails.bind(this, "ticketQuantity")}
          />
          <br />
          <button type="submit" className="pure-button pure-button-primary">
            {" "}Submit{" "}
          </button>
        </fieldset>
      </form>
    );
  }
}
