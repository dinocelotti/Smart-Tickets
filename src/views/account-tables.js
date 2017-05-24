import React from "react";

function theadElement(element) {
  return <th>{element}</th>;
}
function tdElement(element) {
  return <td>{element}</td>;
}
//{this.props.accounts.map(acc => theadElement(acc.address))}
export class AccountTableEth extends React.Component {
  render() {
    const thead = (
      <thead>
        <tr>
          {theadElement("Account addresses")}
          {theadElement("Ether Balance")}
        </tr>
      </thead>
    );
    let id = 0;
    const tbody = (
      <tbody>
        {this.props.accounts.map(acc => (
          <tr key={acc.address}>
            {tdElement(acc.address)}
            {tdElement(acc.ethBalance)}
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
