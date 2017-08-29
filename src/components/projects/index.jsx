import React from 'react'
import { Item, List, Step, Grid, Segment, Header } from 'semantic-ui-react'
import TicketTable from './components/ticket-table'
import ProjectModal from './components/project-modal'
import StateButton from './components/state-button'
import DistributorList from './components/distributor-list'
import propTypes from 'prop-types'
import camelToHuman from 'src/util/stringUtils'

export default class Projects extends React.Component {
	makeStateSteps(state) {
		const states = ['Staging', 'Private Funding', 'Public Funding', 'Done']
		const descriptions = [
			'The promoter is still setting up the project details',
			'Project details have been finalized by the promoters and is now ready to sell tickets to the distributors',
			'  Distributors have finalized their ticket purchases from the promoters and now the promoters and distributors are ready to sell tickets to public',
			'Sale has finished and is finalized, ticket transfers enabled for public'
		]
		return states.map((currentState, idx) => ({
			...(states.indexOf(state) >= idx
				? { completed: true }
				: { active: true }),
			title: currentState,
			description: descriptions[idx]
		}))
	}
	showNextStateButton(state, ticketsLeft, address, promoter) {
		const states = ['Staging', 'Private Funding', 'Public Funding', 'Done']
		const currentStateIdx = states.indexOf(state)
		const nextState =
			currentStateIdx < states.length ? states[currentStateIdx + 1] : null
		return nextState && this.props.currentUser === 'promoter' ? (
			<StateButton
				nextState={nextState}
				ticketsLeft={ticketsLeft}
				promoter={promoter}
				address={address}
			/>
		) : null
	}
	createList({
		/* eslint-disable */
		purchasesFromPromoter,
		purchasesFromDistributor,
		tickets,
		distributors,
		address,
		state /* eslint-enable */,
		...projectObj
	}) {
		const listItems = Object.keys(projectObj).map(attribute => (
			<List.Item key={attribute}>
				<strong> {camelToHuman(attribute)}:</strong> {projectObj[attribute]}
			</List.Item>
		))
		return <List>{listItems}</List>
	}

	createItemFromProject(project) {
		const { projectName, address, state, ticketsLeft, promoter } = project
		return (
			<Segment raised key={address}>
				<Grid relaxed>
					<Grid.Row>
						<Grid.Column>
							<Item.Group>
								<Item>
									<Item.Content>
										<Item.Header>{projectName}</Item.Header>
										<Item.Meta>Contract Address: {address}</Item.Meta>
										<Item.Description>
											{this.createList(project)}
											<TicketTable project={project} {...this.props} />
											<DistributorList
												project={project}
												distributorState={this.props.distributorState}
											/>
										</Item.Description>
										<Item.Extra>
											<ProjectModal project={project} {...this.props} />
											{this.showNextStateButton(
												state,
												ticketsLeft,
												address,
												promoter
											)}
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
		const { byId, ids } = this.props.projectState
		return ids.map(id => this.createItemFromProject(byId[id]))
	}
	render() {
		return (
			//TODO: better loading check for projects
			<Segment loading={!this.props.projectState.ids.length > 0}>
				<Header as="h2" textAlign="center">
					Projects on the blockchain
				</Header>
				{this.createItems()}
			</Segment>
		)
	}
}
