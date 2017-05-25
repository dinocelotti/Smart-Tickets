import { AccountTableEth } from "./../views/account-tables";
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
  return {
    accounts: store.accountState.accounts
  };
}

export const EthTable = connect(mapEthStateToProps)(accountTableEthContainer);
