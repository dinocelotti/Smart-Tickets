import React, { Component } from "react";
import { connect } from "react-redux";
import { EthTable } from "./containers/account-tables-container";
import PromoterSection from "./containers/promoter-section-container";
import EventTables from "./containers/event-tables-container";
import { deployEventResolver } from "./api/event-api";
import "./css/grids-responsive-min.css";
import "./css/oswald.css";
import "./css/open-sans.css";
import "./css/pure-min.css";
import "./App.css";

class App extends Component {
  componentDidMount() {
    deployEventResolver();
  }
  render() {
    if (this.props.eventResolverDeployed) {
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
    } else {
      return null;
    }
  }
}
function mapStateToProps(state) {
  return {
    eventResolverDeployed: state.eventState.eventResolverDeployed
  };
}
export default connect(mapStateToProps)(App);
