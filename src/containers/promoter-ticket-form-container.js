import PromoterTicketForm from "./../views/promoter-ticket-form";
import React, { Component } from "react";
import * as eventApi from "../api/event-api";
export default class PromoterTicketFormContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      /**
         * Tickets
         */
      ticketQuantity: "",
      ticketPrice: "",
      ticketType: "",
      promoterObj: {}
    };

    this.setTicketDetails = this.setTicketDetails.bind(this);
    this.createTickets = this.createTickets.bind(this);
  }
  componentWillReceiveProps({ promoterAddress }) {
    console.log("ticketform", promoterAddress);
  }
  setTicketDetails(name, event) {
    this.setState({
      [name]: event.target.value
    });
  }
  createTickets(event) {
    event.preventDefault();
    eventApi;
  }
  render() {
    return (
      <PromoterTicketForm
        ticketsLeft={this.props.ticketsLeft}
        createTickets={this.createTickets}
        setTicketDetails={this.setTicketDetails}
      />
    );
  }
}
