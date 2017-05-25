import React from "react";

export class PromoterSection extends React.Component {
  render() {
    return (
      <form
        className="pure-form pure-form-stacked"
        onSubmit={this.props.createEvent}
      >

        <legend> An Event Creation Form</legend>
        <fieldset className="pure-group">
          <label htmlFor="eventName"> Event Name </label>
          <input
            id="eventName"
            type="text"
            placeholder="Event Name"
            className="pure-input-3-4"
            onChange={this.props.setEventDetails.bind(this, "eventName")}
          />

          <label htmlFor="totalTickets"> Total number of tickets </label>
          <input
            id="totalTickets"
            type="text"
            placeholder="Total number of tickets"
            className="pure-input-3-4"
            onChange={this.props.setEventDetails.bind(this, "totalTickets")}
          />

          <label htmlFor="consumerMaxTickets">
            {" "}Ticket purchase limit for consumers
          </label>
          <input
            id="consumerMaxTickets"
            type="text"
            placeholder="Ticket purchase limit for consumers"
            className="pure-input-3-4"
            onChange={this.props.setEventDetails.bind(
              this,
              "consumerMaxTickets"
            )}
          />

          <label htmlFor="promoterAddress"> Your wallet address </label>
          <select
            id="promoterAddress"
            className="pure-input-3-4"
            onChange={this.props.setEventDetails.bind(this, "promoterAddress")}
          >
            {this.props.accountAddresses.map(acc => (
              <option key={acc}>{acc}</option>
            ))}
          </select>
          <br />
          <button type="submit" className="pure-button pure-button-primary">
            {" "}Create Event{" "}
          </button>
        </fieldset>
      </form>
    );
  }
}
