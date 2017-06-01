import { PromoterSection } from "./../views/promoter-section";
import React from "react";
import { connect } from "react-redux";
import * as eventApi from "../api/event-api";
import ApprovedBuyer from "./promoter-buyer-container";
import TicketForm from "./promoter-ticket-form-container";
import TicketQuery from "./ticket-query-container";
class PromoterSectionContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      eventName: "",
      totalTickets: "",
      consumerMaxTickets: "",
      promoterAddr: "",
      eventAddr: "",
      promoterInstance: {}
    };
    this.setEventDetails = this.setEventDetails.bind(this);
    this.createEvent = this.createEvent.bind(this);
    this.setEventAddr = this.setEventAddr.bind(this);
    this.setPromoterAddr = this.setPromoterAddr.bind(this);
  }
  //takes an obj
  setStateAsync(state) {
    return new Promise(res => {
      this.setState(state, res);
    });
  }

  setEventDetails(name, event) {
    this.setState({
      [name]: event.target.value
    });
  }
  async setEventAddr(event) {
    const eventAddr = event.target.value;
    await this.setState({ eventAddr });
    await this.setPromoterInstance();
  }

  async setPromoterAddr(event) {
    const promoterAddr = event.target.value;
    await this.setStateAsync({ promoterAddr });
    await this.setPromoterInstance();
  }
  isEmptyObject(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  }

  samePromoterInstance(prevInstance, newInstance) {
    return (
      prevInstance.eventAddr === newInstance.eventAddr &&
      prevInstance.promoterAddr === newInstance.promoterAddr
    );
  }

  async setPromoterInstance() {
    const { promoterAddr, eventAddr } = this.state;

    //check to see if both fields are set
    if (promoterAddr.length === 0 || eventAddr.length === 0) return;

    const prevInstance = this.state.promoterInstance;
    if (
      !this.isEmptyObject(prevInstance) &&
      this.samePromoterInstance(prevInstance, { promoterAddr, eventAddr })
    )
      return;

    const promoterInstance = new eventApi.Promoter(promoterAddr, eventAddr);
    await promoterInstance.init();
    await this.setStateAsync({ promoterInstance });
  }

  async componentWillReceiveProps({ events, accountAddresses }) {
    if (events.length > 0) {
      const defaultEvent = events[0];
      await this.setEventAddr(this.mockTarget(defaultEvent.eventAddr));
      //check if current owners addresses is the promoter of the current event
      if (accountAddresses.includes(defaultEvent.promoterAddr)) {
        await this.setPromoterAddr(this.mockTarget(defaultEvent.promoterAddr));
      }
    }
  }

  createEvent(event) {
    event.preventDefault();
    const eventDetails = this.state;

    if (!eventDetails.promoterAddr) {
      eventDetails.promoterAddr = this.props.accountAddresses[0];
    }

    eventApi.createEvent(eventDetails);
  }

  mockTarget(value) {
    return {
      target: {
        value
      }
    };
  }

  render() {
    return (
      <div>
        <PromoterSection
          setEventDetails={this.setEventDetails}
          createEvent={this.createEvent}
          createdEvent={this.props.events}
          accountAddresses={this.props.accountAddresses}
        />
        <form className="pure-form pure-form-stacked">
          <legend> Promoter Contract Interaction </legend>
          <label htmlFor="promoterAddr"> Promoter Address to use</label>
          <select id="promoterAddr" onChange={this.setPromoterAddr}>
            {this.props.accountAddresses.map((acc, index) => {
              return this.props.events.map(({ promoterAddr, eventAddr }) => {
                if (
                  acc === promoterAddr && this.state.eventAddr === eventAddr
                ) {
                  return <option key={acc}>{acc}</option>;
                }
              });
            })}
          </select>
          <label htmlFor="eventAddr">
            {" "}Contract Address to interact with
          </label>
          <select id="eventAddr" onChange={this.setEventAddr}>
            {this.props.events.map(({ eventAddr }) => (
              <option key={eventAddr}>{eventAddr}</option>
            ))}
          </select>
          <br />
        </form>
        <div className="pure-u-1-3">
          <ApprovedBuyer />
        </div>
        <div className="pure-u-1-3">
          <TicketForm promoterInstance={this.state.promoterInstance} />
        </div>
        <div className="pure-u-1-3">
          <TicketQuery promoterInstance={this.state.promoterInstance} />
        </div>
      </div>
    );
  }
}
function mapStateToProps(state) {
  return {
    events: state.eventState.events,
    accountAddresses: state.accountState.accounts.map(acc => acc.address),
    accountAssociatedEvents: state.accountState.associatedEvents
  };
}
export default connect(mapStateToProps)(PromoterSectionContainer);
