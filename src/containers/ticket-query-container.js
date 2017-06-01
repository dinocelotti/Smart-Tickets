import TicketQueryForm from "./../views/ticket-query-form";
import React, { Component } from "react";

export default class TicketQueryFormContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ticketType: "",
      ticketQuantity: "",
      ticketPrice: ""
    };
    this.setTicketDetails = this.setTicketDetails.bind(this);
    this.queryTicket = this.queryTicket.bind(this);
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

  setTicketDetails(name, event) {
    this.setState({
      [name]: event.target.value
    });
  }

  async queryTicket(event) {
    event.preventDefault();
    const { promoterInstance } = this.props;
    //check object exists
    if (this.isEmptyObject(promoterInstance)) return;
    const queryResult = await promoterInstance.getTicketDetails(
      this.state.ticketType
    );
    console.log(queryResult);
    this.setStateAsync(queryResult);
  }
  render() {
    return (
      <TicketQueryForm
        ticketPrice={this.state.ticketPrice}
        ticketQuantity={this.state.ticketQuantity}
        queryTicket={this.queryTicket}
        setTicketDetails={this.setTicketDetails}
      />
    );
  }
}
