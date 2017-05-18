import React from "react";

function theadElement(element) {
  return <th>{element}</th>;
}
function tdElement(element) {
  return <td>{element}</td>;
}
export class accountTableEth extends React.Component {
  render() {
    const thead = (
      <thead>
        <tr>
          {theadElement("Account addresses")}
          {this.props.accounts.map(acc => theadElement(acc.address))}
        </tr>
      </thead>
    );
    const tbody = (
      <tbody>
        <tr>
          {tdElement("ETH balance")}
          {this.props.accounts.map(acc => tdElement(acc.ethBalance))}
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
export class accountTableEvents extends React.Component {
  render() {
    const thead = (
      <thead>
        <tr>
          {theadElement("Events")}
          {this.props.events.map(event => theadElement(event.name))}
        </tr>
      </thead>
    );
    /**
         *[acc1: {events: [1, 2, 3]}]
         */
    const tbody = (
      <tbody>
        {this.props.accounts.map(acc => (
          <tr>
            {tdElement(`Address: ${acc.address}`)}
            {this.props.acc.events.map(numOfTickets => tdElement(numOfTickets))}
          </tr>
        ))}
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
