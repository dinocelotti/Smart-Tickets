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
      ticketType: "",
      ticketsLeft: 0
    };

    this.setTicketDetails = this.setTicketDetails.bind(this);
    this.setTicketsLeft = this.setTicketsLeft.bind(this);
    this.createTickets = this.createTickets.bind(this);
  }

  isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  //takes an obj
  setStateAsync(state) {
    return new Promise(res => {
      this.setState(state, res);
    });
  }

  async componentWillReceiveProps({ promoterInstance }) {
    if (this.isEmptyObject(promoterInstance)) return;

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

  async createTickets(event) {
    event.preventDefault();
    console.log("create tickets called");
    await this.props.promoterInstance.handleTicketForm(this.state);
    const ticketsLeft = await this.props.promoterInstance.getNumOfTicketsLeft();
    await this.setTicketsLeft(ticketsLeft);
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
