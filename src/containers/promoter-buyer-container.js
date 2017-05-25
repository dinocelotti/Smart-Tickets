import PromoterBuyerForm from "./../views/promoter-buyer-form";
import React, { Component } from "react";

export default class PromoterApprovedBuyerContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      approvedBuyerAddress: "",
      buyerAllottedQuantities: "",
      approvedBuyerFee: ""
    };

    this.setBuyerDetails = this.setBuyerDetails.bind(this);
    this.createApprovedBuyer = this.createApprovedBuyer.bind(this);
  }
  setBuyerDetails(name, event) {
    this.setState({
      [name]: event.target.value
    });
  }
  createApprovedBuyer() {
    this.props.createApprovedBuyer(this.state);
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
