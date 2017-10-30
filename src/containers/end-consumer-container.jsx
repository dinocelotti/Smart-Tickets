import React, { Component } from 'react';
import Layout from '../components/Layout';
import { connect } from 'react-redux';
import propTypes from 'prop-types';
import EndUser from '../components/endconsumer';
import Projects from './projects-container';
import store from '../store';
class EndConsumerContainer extends Component {
  static propTypes = {
    accounts: propTypes.object,
    projects: propTypes.array,
    projectsByAddress: propTypes.object
  };

  render() {
    //if the info menu is selected, render info
    //else render form menu
    return (
      <Layout heading="End Consumer View">
        <EndUser accounts={this.props.accounts} store={store} />
        <Projects currentUser={'endConsumer'} />
      </Layout>
    );
  }
}

function mapStateToProps({ projectState, accountState }) {
  return {
    projects: projectState.ids,
    projectsByAddress: projectState.byId,
    accounts: accountState
  };
}
export default connect(mapStateToProps)(EndConsumerContainer);
