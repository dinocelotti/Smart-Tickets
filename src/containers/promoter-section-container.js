import { PromoterSection } from "./../views/promoter-section";
import React from "react";
import { connect } from "react-redux";
import * as accountApi from "../api/account-api";
import * as eventApi from "../api/event-api";

class PromoterSectionContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      eventName: "",
      totalTickets: "",
      consumerMaxTickets: ""
    };
    this.setEventDetails = this.setEventDetails.bind(this);
    this.createEvent = this.createEvent.bind(this);
  }
  setEventDetails(name, event) {
    console.log(this.state);
    this.setState({
      [name]: event.target.value
    });
  }
  createEvent(event) {
    event.preventDefault();
    console.log("state", this.state);

    const eventDetails = this.state;
    eventApi.createEvent(eventDetails);
  }
  render() {
    return (
      <PromoterSection
        setEventDetails={this.setEventDetails}
        createEvent={this.createEvent}
        createdEvent={this.props.events}
      />
    );
  }
}
function mapStateToProps(state) {
  return { events: state.eventState.events };
}
export default connect(mapStateToProps)(PromoterSectionContainer);
