import React, { Component } from "react";

export default class PromoterBuyerForm extends Component {
  render() {
    return (
      <form
        className="pure-form pure-form-stacked"
        onSubmit={this.props.createApprovedBuyer}
      >
        <label htmlFor="approvedBuyerAddress"> Approved Buyer Address</label>
        <input
          type="text"
          id="approvedBuyerAddress"
          onChange={this.props.setBuyerDetails.bind(
            this,
            "approvedBuyerAddress"
          )}
          className="pure-input-3-4"
          placeholder="Buyer address"
        />
        <label htmlFor="buyerAllottedQuantities"> Allotted Quantity </label>
        <input
          type="text"
          id="buyerAllottedQuantities"
          onChange={this.props.setBuyerDetails.bind(
            this,
            "buyerAllottedQuantities"
          )}
          className="pure-input-3-4"
          placeholder="Allotted Quantities"
        />
        <label htmlFor="ticketType"> Ticket Type</label>
        <input
          type="text"
          id="ticketType"
          className="pure-input-3-4"
          onChange={this.props.setBuyerDetails.bind(this, "ticketType")}
        />
        <label htmlFor="approvedBuyerFee"> Fee for Approved Buyer </label>
        <input
          type="text"
          id="approvedBuyerFee"
          onChange={this.props.setBuyerDetails.bind(this, "approvedBuyerFee")}
          className="pure-input-3-4"
          placeholder="Fee in Percent"
        />
        <br />
        <button type="submit" className="pure-button pure-button-primary">
          {" "}Submit{" "}
        </button>
      </form>
    );
  }
}
