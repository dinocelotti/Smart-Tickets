import PromoterTicketForm from "./../views/promoter-ticket-form";
import React, { Component } from "react";
import * as eventApi from "../api/event-api";
import { connect } from "react-redux";
class PromoterTicketFormContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      /**
         * Tickets
         */
      ticketQuantity: "",
      ticketPrice: "",
      ticketType: "",
      ticketsLeft: 0
    };

    this.setTicketDetails = this.setTicketDetails.bind(this);
    this.setTicketsLeft = this.setTicketsLeft.bind(this);
    this.createTickets = this.createTickets.bind(this);
  }

  //takes an obj
  setStateAsync(state) {
    return new Promise(res => {
      this.setState(state, res);
    });
  }

  async componentWillReceiveProps({ promoterInstance }) {
    const ticketsLeft = await promoterInstance.getNumOfTicketsLeft();
    await this.setTicketsLeft(ticketsLeft);
  }
  async setTicketsLeft(ticketsLeft) {
    await this.setStateAsync({ ticketsLeft });
  }
  setTicketDetails(name, event) {
    this.setState({
      [name]: event.target.value
    });
  }
  createTickets(event) {
    //update the promoter object  here

    event.preventDefault();
  }
  render() {
    return (
      <PromoterTicketForm
        ticketsLeft={this.state.ticketsLeft}
        createTickets={this.createTickets}
        setTicketDetails={this.setTicketDetails}
      />
    );
  }
}
function mapStateToProps(state) {
  const currentPromoter = state.promoterState;
  if (!currentPromoter.getNumOfTicketsLeft) {
    return {
      ticketsLeft: 0
    };
  }

  currentPromoter.getNumOfTicketsLeft().then(numTix => {
    return {
      ticketsLeft: numTix
    };
  });
}

export default connect(mapStateToProps)(PromoterTicketFormContainer);
