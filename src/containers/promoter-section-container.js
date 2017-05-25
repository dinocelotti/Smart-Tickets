import { PromoterSection } from "./../views/promoter-section";
import React from "react";
import { connect } from "react-redux";
import * as eventApi from "../api/event-api";
import ApprovedBuyer from "./promoter-buyer-container";
import TicketForm from "./promoter-ticket-form-container";
class PromoterSectionContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      eventName: "",
      totalTickets: "",
      consumerMaxTickets: "",
      promoterAddress: ""
    };
    this.setEventDetails = this.setEventDetails.bind(this);
    this.createEvent = this.createEvent.bind(this);
  }
  setEventDetails(name, event) {
    this.setState({
      [name]: event.target.value
    });
  }
  createEvent(event) {
    event.preventDefault();

    const eventDetails = this.state;
    if (!eventDetails.promoterAddress) {
      eventDetails.promoterAddress = this.props.accountAddresses[0];
    }
    eventApi.createEvent(eventDetails);
  }
  render() {
    return (
      <div>
        <PromoterSection
          setEventDetails={this.setEventDetails}
          createEvent={this.createEvent}
          createdEvent={this.props.events}
          accountAddresses={this.props.accountAddresses}
        />
        <form className="pure-form">
          <legend> Promoter Contract Interaction </legend>
        </form>
        <div className="pure-u-1-2">
          <ApprovedBuyer />
        </div>
        <div className="pure-u-1-2">
          <TicketForm />
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    events: state.eventState.events,
    accountAddresses: state.accountState.accounts.map(acc => acc.address)
  };
}
export default connect(mapStateToProps)(PromoterSectionContainer);
