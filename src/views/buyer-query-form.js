import React, { Component } from "react";

export default class BuyerQueryForm extends Component {
  render() {
    return (
      <form
        className="pure-form pure-form-stacked"
        onSubmit={this.props.queryBuyer}
      >
        <fieldset className="pure-group">
          <label htmlFor="ticketType"> Ticket Type</label>
          <input
            type="text"
            id="ticketType"
            className="pure-input-3-4"
            onChange={this.props.setBuyerDetails.bind(this, "ticketType")}
          />
          <label htmlFor="buyerAddr"> Buyer Address </label>
          <input
            type="text"
            id="buyerAddr"
            className="pure-input-3-4"
            onChange={this.props.setBuyerDetails.bind(this, "buyerAddr")}
          />
          <label htmlFor="buyerFee"> Buyer Fee </label>
          <input
            type="text"
            id="buyerFee"
            className="pure-input-3-4"
            value={this.props.buyerFee}
            readOnly
          />
          <label htmlFor="promoterFee"> Promoter Fee </label>
          <input
            type="text"
            id="promoterFee"
            className="pure-input-3-4"
            value={this.props.promoterFee}
            readOnly
          />
          <label htmlFor="buyerAllottedQuantities"> Allotted Quantity </label>
          <input
            type="text"
            id="buyerAllottedQuantities"
            className="pure-input-3-4"
            value={this.props.buyerAllottedQuantities}
            readOnly
          />
          <label htmlFor="isApproved"> Buyer is Approved </label>
          <input
            type="text"
            id="isApproved"
            className="pure-input-3-4"
            value={this.props.isApproved}
            readOnly
          />
          <br />
          <button type="submit" className="pure-button pure-button-primary">
            {" "}Submit{" "}
          </button>
        </fieldset>
      </form>
    );
  }
}
