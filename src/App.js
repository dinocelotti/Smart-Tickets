import React, { Component } from "react";
import { EthTable } from "./containers/account-tables-container";
import PromoterSection from "./containers/promoter-section-container";
import EventTables from "./containers/event-tables-container";
import "./css/grids-responsive-min.css";
import "./css/oswald.css";
import "./css/open-sans.css";
import "./css/pure-min.css";
import "./App.css";

export default class App extends Component {
  render() {
    return (
      <div className="App ">
        <nav className="navbar pure-menu pure-menu-horizontal">

          <a href="#" className="pure-menu-heading pure-menu-link">
            Membran Smart-Tickets
          </a>
        </nav>
        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <EthTable />
            </div>
            <div className="pure-u-1-1">
              <PromoterSection />
            </div>
            <div className="pure-u-1-1">
              <EventTables />
            </div>
          </div>
        </main>
      </div>
    );
  }
}
