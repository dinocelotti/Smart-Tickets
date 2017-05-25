import PromoterTicketForm from "./../views/promoter-ticket-form";
import React, { Component } from "react";

export default class PromoterTicketFormContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      /**
         * Tickets
         */
      ticketQuantity: "",
      ticketPrice: "",
      tickeType: ""
    };

    this.setTicketDetails = this.setTicketDetails.bind(this);
    this.createTickets = this.createTickets.bind(this);
  }
  setTicketDetails(name, event) {
    this.setState({
      [name]: event.target.value
    });
  }
  createTickets() {
    this.props.createTickets(this.state);
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
