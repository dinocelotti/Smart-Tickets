import { AccountTableEth, accountTableEvents } from "./../views/account-tables";
import React from "react";
import { connect } from "react-redux";
import * as accountApi from "../api/account-api";

class accountTableEthContainer extends React.Component {
  componentDidMount() {
    //get account addresses
    accountApi.getAccounts();
  }
  render() {
    return <AccountTableEth accounts={this.props.accounts} />;
  }
}
function mapEthStateToProps(store) {
  console.log(store);
  return {
    accounts: store.accountState.accounts
  };
}

class accountTableEventsContainer extends React.Component {
  componentDidMount() {}
  render() {}
}
function mapEventStateToProps(store) {
  return {};
}

export const EthTable = connect(mapEthStateToProps)(accountTableEthContainer);
export const eventTable = connect(mapEventStateToProps)(
  accountTableEventsContainer
);
