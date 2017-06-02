import PromoterBuyerForm from "./../views/promoter-buyer-form";
import React, { Component } from "react";

export default class PromoterApprovedBuyerContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      approvedBuyerAddress: "",
      buyerAllottedQuantities: "",
      approvedBuyerFee: "",
      ticketType: ""
    };

    this.setBuyerDetails = this.setBuyerDetails.bind(this);
    this.createApprovedBuyer = this.createApprovedBuyer.bind(this);
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

  setBuyerDetails(name, event) {
    this.setState({
      [name]: event.target.value
    });
  }

  createApprovedBuyer(event) {
    event.preventDefault();
    if (this.isEmptyObject(this.props.promoterInstance)) return;
    this.props.promoterInstance.handleBuyerForm(this.state);
  }
  render() {
    return (
      <PromoterBuyerForm
        createApprovedBuyer={this.createApprovedBuyer}
        setBuyerDetails={this.setBuyerDetails}
      />
    );
  }
}
