import React from "react";

function theadElement(element) {
  return <th>{element}</th>;
}
function tdElement(element) {
  return <td>{element}</td>;
}
//{this.props.accounts.map(acc => theadElement(acc.address))}
export default class EventTable extends React.Component {
  render() {
    const thead = (
      <thead>
        <tr>
          {theadElement("Event Name")}
          {theadElement("Max Tickets")}
          {theadElement("Max Transfers")}
          {theadElement("Promoter Address")}
          {theadElement("Contract Address")}
        </tr>
      </thead>
    );
    const tbody = (
      <tbody>
        <tr>
          {tdElement(this.props.eventDetails.eventName)}
          {tdElement(this.props.eventDetails.totalTickets)}
          {tdElement(this.props.eventDetails.consumerMaxTickets)}
          {tdElement(this.props.eventDetails.promoterAddress)}
          {tdElement(this.props.eventDetails.contractAddress)}
        </tr>
      </tbody>
    );
    return (
      <table className="pure-table">
        {thead}
        {tbody}
      </table>
    );
  }
}
