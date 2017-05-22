import { PromoterSection } from "./../views/promoter-section";
import React from "react";
import { connect } from "react-redux";
import * as accountApi from "../api/account-api";
import * as eventApi from "../api/event-api";

class PromoterSectionContainer extends React.Component {
  constructor(props) {
    super(props);
    this.setEventDetails.bind(this);
    this.state = {
      eventName: "",
      totalTickets: "",
      consumerMaxTickets: ""
    };
  }
  setEventDetails(name, event) {
    this.setState({
      [name]: event.target.value
    });
  }
  createEvent() {
    const eventDetails = this.state;
    eventApi.createEvent(...eventDetails);
  }
  render() {
    return <PromoterSection setEventDetails={this.setEventDetails} />;
  }
}
function mapStateToProps(state) {
  return {};
}
export default connect(mapStateToProps)(PromoterSectionContainer);
