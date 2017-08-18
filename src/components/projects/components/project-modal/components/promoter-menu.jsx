import React, { Component } from 'react'
import { Grid, Menu, Segment } from 'semantic-ui-react'
import TicketForm from './ticket-form'
import DistributorForm from './distributor-form'
import TicketTable from '../../ticket-table'

export default class MenuExampleTabularOnRight extends Component {
	state = { activeItem: 'ticket-form' }

	handleItemClick = (e, { name }) => this.setState({ activeItem: name })

	render() {
		const { activeItem } = this.state

		return (
			<Grid>
				<Grid.Row>
					<Grid.Column stretched width={12}>
						<TicketTable {...this.props} />
					</Grid.Column>
				</Grid.Row>
				<Grid.Row>
					<Grid.Column stretched width={12}>
						{activeItem === 'ticket-form'
							? <TicketForm {...this.props} />
							: <DistributorForm {...this.props} />}
					</Grid.Column>

					<Grid.Column width={4}>
						<Menu fluid vertical tabular="right">
							<Menu.Item
								name="ticket-form"
								active={activeItem === 'ticket-form'}
								onClick={this.handleItemClick}
							/>
							<Menu.Item
								name="distributor-form"
								active={activeItem === 'distributor-form'}
								onClick={this.handleItemClick}
							/>
						</Menu>
					</Grid.Column>
				</Grid.Row>
			</Grid>
		)
	}
}
