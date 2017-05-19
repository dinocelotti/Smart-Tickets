import React, { Component } from "react";
import { EthTable } from "./containers/account-tables-container";
import "./css/oswald.css";
import "./css/open-sans.css";
import "./css/pure-min.css";
import "./App.css";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      storageValue: 0
    };
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">

          <a href="#" className="pure-menu-heading pure-menu-link">
            Truffle Box
          </a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1> Good to Go! </h1>
              <p> Your Truffle Box is installed and ready. </p>
              <h2> Smart Contract Example </h2>
              <EthTable />
              <p>
                The below will show a stored value of 5 by
                default
                if your contracts compiled and migrated successfully.
              </p>

              <p>
                Try changing the value stored on
                <strong> line 50 </strong>
                of App.js.
              </p>
              <p> The stored value is: {this.state.storageValue} </p>
            </div>
          </div>
        </main>
      </div>
    );
  }
}
