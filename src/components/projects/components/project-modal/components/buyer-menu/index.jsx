import React, { Component } from 'react';
import { Grid, Menu } from 'semantic-ui-react';

import TicketTable from '../../../ticket-table';

import DPurchaseForm from './distributor-purchase-form';
import PPurchaseForm from './promoter-purchase-form';

export default class MenuExampleTabularOnRight extends Component {
  state = { activeItem: 'promoter' };

  handleItemClick = name => () => {
    this.setState({ activeItem: name });
  };

  render() {
    const { activeItem } = this.state;

    return (
      <Grid>
        <Grid.Row>
          <Grid.Column stretched width={12}>
            <TicketTable {...this.props} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column stretched width={12}>
            {activeItem === 'promoter' ? (
              <PPurchaseForm {...this.props} />
            ) : (
              <DPurchaseForm {...this.props} />
            )}
          </Grid.Column>

          <Grid.Column width={4}>
            <Menu fluid vertical tabular="right">
              <Menu.Item
                name="Purchase ticket from promoter of project"
                active={activeItem === 'promoter'}
                onClick={this.handleItemClick('promoter')}
              />
              <Menu.Item
                name="Purchase ticktet from a distributor of the project"
                active={activeItem === 'distributor'}
                onClick={this.handleItemClick('distributor')}
              />
            </Menu>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
