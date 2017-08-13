import React from 'react'
import {
	Item,
	List,
	Step,
	Grid,
	Segment,
	Header,
	Table,
	Accordion,
	Icon
} from 'semantic-ui-react'
import UserModal from './userModal'
import propTypes from 'prop-types'

export default class Projects extends React.Component {
	static propTypes = {
		projectState: propTypes.arrayOf(
			propTypes.shape({
				projectName: propTypes.string,
				totalTickets: propTypes.string,
				consumerMaxTickets: propTypes.string,
				promoter: propTypes.string,
				address: propTypes.string,
				state: propTypes.string
			})
		)
	}
	makeStateSteps(state) {
		const stages = ['Staging', 'PrivateSale', 'PublicSale', 'Done']
		const descriptions = [
			'The promoter is still setting up the project details',
			'Project details have been finalized by the promoters and is now ready to sell tickets to the distributors',
			'  Distributors have finalized their ticket purchases from the promoters and now the promoters and distributors are ready to sell tickets to public',
			'Sale has finished and is finalized, ticket transfers enabled for public'
		]
		return stages.map((stage, idx) => ({
			...(stages.indexOf(state) >= idx
				? { completed: true }
				: { active: true }),
			title: stage,
			description: descriptions[idx]
		}))
	}
	TicketsFromProject({ tickets, distributors }) {
		const distributorBreakdownPerTicket = ticketId => {
			const { ticketsByDistributor } = this.props.distributors

			return (
				Object.keys(ticketsByDistributor).length > 0 &&
				distributors.reduce((ticketBreakdown, currentDistributor) => {
					const currentDistributorsTickets =
						ticketsByDistributor[currentDistributor]
					if (!currentDistributorsTickets) return ticketBreakdown
					const ticketToCheck = currentDistributorsTickets[ticketId]
					return ticketToCheck
						? [
								...ticketBreakdown,
								{
									distributor: currentDistributor,
									ticketBreakdown: ticketToCheck
								}
							]
						: ticketBreakdown
				}, [])
			)
		}

		const { byId: ticketsById } = this.props.tickets
		const headerRow = ['Type', 'Price in Wei', 'Quantity', 'Breakdown']
		const tableData = tickets.map(id => {
			const { typeOfTicket: type, price, quantity } = ticketsById[id]
			const breakdown = distributorBreakdownPerTicket(id)
			return { type, price, quantity, breakdown }
		})
		const renderBodyRow = ({ type, price, quantity, breakdown }, i) => ({
			key: type || `row-${i}`,
			cells: [
				type,
				{ key: `${type}-price`, content: price },
				{
					key: `${type}-quantity`,
					content: quantity
				},
				breakdown
					? {
							key: `${type}-breakdown`,
							content: (
								<Accordion>
									<Accordion.Title>
										<Icon name="dropdown" />
										Distributor Breakdown
									</Accordion.Title>
									<Accordion.Content>
										<List>
											{breakdown.map(({ distributor, ticketBreakdown }) =>
												<List.Item key={`${type}-breakdown-${distributor}`}>
													{distributor.split('_')[0]}

													<List.List>
														AllottedQuantity: {ticketBreakdown.allottedQuantity}
													</List.List>
												</List.Item>
											)}
										</List>
									</Accordion.Content>
								</Accordion>
							)
						}
					: 'none'
			]
		})

		return (
			<Table
				basic="very"
				headerRow={headerRow}
				renderBodyRow={renderBodyRow}
				tableData={tableData}
			/>
		)
	}
	DistributorsFromProject({ distributors }) {}

	createItemFromProject(project) {
		const {
			projectName,
			totalTickets,
			consumerMaxTickets,
			promoter,
			address,
			state,
			ticketsLeft
		} = project
		return (
			<Segment raised key={address}>
				<Grid relaxed>
					<Grid.Row>
						<Grid.Column>
							<Item.Group>
								<Item>
									<Item.Content>
										<Item.Header>
											{projectName}
										</Item.Header>
										<Item.Meta>
											Contract Address: {address}
										</Item.Meta>
										<Item.Description>
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
											</List>
											{this.TicketsFromProject(project)}
										</Item.Description>
										<Item.Extra>
											<UserModal
												project={project}
												accounts={this.props.accounts}
												currentUser={this.props.currentUser}
											/>
										</Item.Extra>
									</Item.Content>
								</Item>
							</Item.Group>
						</Grid.Column>
					</Grid.Row>
					<Grid.Row>
						<Grid.Column>
							<Step.Group vertical items={this.makeStateSteps(state)} />
						</Grid.Column>
					</Grid.Row>
				</Grid>
			</Segment>
		)
	}
	createItems() {
		const projectIds = this.props.projects.ids
		const projects = this.props.projects.byId
		return projectIds.map(id => this.createItemFromProject(projects[id]))
	}
	render() {
		return (
			//TODO: better loading check for projects
			<Segment loading={!this.props.projects.ids.length > 0}>
				<Header as="h2" textAlign="center">
					Projects on the blockchain
				</Header>
				{this.createItems()}
			</Segment>
		)
	}
}
