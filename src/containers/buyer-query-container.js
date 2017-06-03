import BuyerQueryForm from "./../views/buyer-query-form";
import React, { Component } from "react";

export default class PromoterApprovedBuyerContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      buyerAddr: "",
      ticketType: "",
      buyerFee: "",
      buyerAllottedQuantities: "",
      isApproved: "false",
      promoterFee: ""
    };

    this.setBuyerDetails = this.setBuyerDetails.bind(this);
    this.queryBuyer = this.queryBuyer.bind(this);
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

  async queryBuyer(event) {
    event.preventDefault();
    if (this.isEmptyObject(this.props.promoterInstance)) return;
    const [
      isApproved,
      buyerAllottedQuantities,
      buyerFee,
      promoterFee
    ] = await this.props.promoterInstance.queryBuyer(this.state);
    await this.setStateAsync({
      isApproved,
      buyerAllottedQuantities,
      buyerFee,
      promoterFee
    });
  }
  render() {
    return (
      <BuyerQueryForm
        queryBuyer={this.queryBuyer}
        setBuyerDetails={this.setBuyerDetails}
        buyerFee={this.state.buyerFee}
        promoterFee={this.state.promoterFee}
        buyerAllottedQuantities={this.state.buyerAllottedQuantities}
        isApproved={this.state.isApproved}
      />
    );
  }
}
