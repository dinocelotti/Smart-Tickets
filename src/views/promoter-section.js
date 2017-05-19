import React from "react";

export class PromoterSection extends React.Component {
  render() {
    return (
      <form className="pure-form" onSubmit={this.props.createEvent}>
        <fieldset>
          <legend> An Event Creation Form</legend>
          <input type="eventName" placeholder="Event Name" />
          <input type="totalTickets" placeholder="Total number of tickets" />
          <input
            type="consumerMaxTickets"
            placeholder="Ticket purchase limit for consumers"
          />
          <button type="submit" className="pure-button pure-button-primary">
            {" "}Create Event{" "}
          </button>
        </fieldset>
      </form>
    );
  }
}
