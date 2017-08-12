import React from 'react'
import { Item, List, Step, Grid, Segment, Header } from 'semantic-ui-react'
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
	createItemFromProject(project) {
		const {
			projectName,
			totalTickets,
			consumerMaxTickets,
			promoter,
			address,
			state
		} = project
		return (
			<Segment raised key={address}>
				<Grid columns={2} relaxed>
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
												<strong> Consumer Ticket Limit: </strong>
												{consumerMaxTickets}
											</List.Item>
											<List.Item>
												<strong> Promoter's Account Address: </strong>
												{promoter}
											</List.Item>
										</List>
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
					<Grid.Column>
						<Step.Group
							vertical
							size="mini"
							items={this.makeStateSteps(state)}
						/>
					</Grid.Column>
				</Grid>
			</Segment>
		)
	}
	createItems() {
		const projectIds = this.props.projects.ids
		const projects = this.props.projects.byId
		const accounts = this.props.accounts
		console.log(accounts)
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
