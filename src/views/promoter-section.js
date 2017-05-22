import React from "react";

export class PromoterSection extends React.Component {
  render() {
    return (
      <form
        className="pure-form pure-form-stacked"
        onSubmit={this.props.setEventDetails}
      >
        <fieldset>
          <legend> An Event Creation Form</legend>
          <label htmlFor="eventName"> Event Name </label>
          <input
            id="eventName"
            type="eventName"
            placeholder="Event Name"
            onChange={this.props.setEventDetails.bind(this, "eventName")}
          />

          <label htmlFor="totalTickets"> Total number of tickets </label>
          <input
            id="totalTickets"
            type="totalTickets"
            placeholder="Total number of tickets"
            onChange={this.props.setEventDetails.bind(this, "totalTickets")}
          />

          <label htmlFor="consumerMaxTickets">
            {" "}Ticket purchase limit for consumers
          </label>
          <input
            id="consumerMaxTickets"
            type="consumerMaxTickets"
            placeholder="Ticket purchase limit for consumers"
            onChange={this.props.setEventDetails.bind(
              this,
              "consumerMaxTickets"
            )}
          />
          <br />
          <button type="submit" className="pure-button pure-button-primary">
            {" "}Create Event{" "}
          </button>
        </fieldset>
      </form>
    );
  }
}
