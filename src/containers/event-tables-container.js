import EventTable from "./../views/event-tables";
import React from "react";
import { connect } from "react-redux";

class EventTableContainer extends React.Component {
  render() {
    if (this.props.events[0])
      return (
        <div>
          <h1>Newly Created Events</h1>
          {" "}
          {this.props.events.map(event => (
            <EventTable key={event.contractAddress} eventDetails={event} />
          ))}
        </div>
      );
    return null;
  }
}
function mapEventStateToProps(store) {
  return {
    events: store.eventState.events
  };
}

export default connect(mapEventStateToProps)(EventTableContainer);
