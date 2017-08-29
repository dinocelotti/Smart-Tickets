import { List, Grid, Modal, Button, Header } from 'semantic-ui-react'
import BuyerMenu from './components/buyer-menu'
import React from 'react'
import PromoterMenu from './components/promoter-menu'
const ProjectModal = ({
	project,
	accounts,
	currentUser,
	ticketState,
	distributorState
}) => {
	const {
		projectName,
		totalTickets,
		consumerMaxTickets,
		promoter,
		ticketsLeft,
		address,
		state
	} = project
	const userTypeMapping = {
		promoter: {
			button: 'Edit Project',
			Display: (
				<div>
					<PromoterMenu
						{...{
							project,
							ticketState,
							distributorState,
							promoter,
							address,
							accounts
						}}
					/>
				</div>
			)
		},
		distributor: {
			button: 'Purchase Tickets',
			Display: (
				<div>
					<BuyerMenu
						{...{
							address,
							isDistributor: true,
							project,
							accounts,
							ticketState,
							distributorState
						}}
					/>
				</div>
			)
		},
		endConsumer: {
			button: 'Purchase Tickets',
			Display: (
				<div>
					<BuyerMenu
						{...{
							address,
							isDistributor: false,
							project,
							accounts,
							ticketState,
							distributorState
						}}
					/>
				</div>
			)
		}
	}
	const thisUser = userTypeMapping[currentUser]

	return (
		<Modal trigger={<Button>{thisUser.button}</Button>}>
			<Modal.Header>
				<Grid columns={2}>
					<Grid.Column width="4">
						<Header as="h3" textAlign="left">
							{projectName}
						</Header>
					</Grid.Column>
					<Grid.Column width="12">
						<Header as="h4" textAlign="right">
							Contract Address: {address}
						</Header>
					</Grid.Column>
				</Grid>
			</Modal.Header>
			<Modal.Content>
				<Modal.Description>
					<List>
						<List.Item>
							<strong> Total Tickets: </strong> {totalTickets}
						</List.Item>
						<List.Item>
							<strong> Tickets Left: </strong>
							{ticketsLeft}
						</List.Item>
						<List.Item>
							<strong> Consumer Ticket Limit: </strong>
							{consumerMaxTickets}
						</List.Item>
						<List.Item>
							<strong> Promoter's Account Address: </strong>
							{promoter}
						</List.Item>
						<List.Item>
							<strong> State: </strong>
							{state}
						</List.Item>
					</List>
					{thisUser.Display}
				</Modal.Description>
			</Modal.Content>
		</Modal>
	)
}
export default ProjectModal
