import React, { Component } from 'react'
import {
	Form,
	Dropdown,
	Button,
	Header,
	Label,
	Segment
} from 'semantic-ui-react'
import propTypes from 'prop-types'
import projectApi from '../../api/project-api'
import withDefaultInfo from 'src/util/withDefaultInfo'
const segmentGeneratorFields = {
	personalInfo: {},
	personalBalance: {},
	ticketsOwned: {}
}
class EndUser extends Component {
	static propTypes = {
		accounts: propTypes.object
	}
	handleChange = this.props.handleChange
	state = {}
	createDropdownItems() {
		return this.props.accounts.ids.map(id => ({
			value: id,
			text: id,
			description: `Balance in wei: ${this.props.accounts.byId[id].balance}`
		}))
	}

	handleSubmit = async () => {
		this.setState(() => ({ loading: true }))
		await projectApi.setUser(this.props.data)
		this.setState(() => ({ loading: false }))
	}

	render() {
		const accountAddressFormField = (
			<Form.Field required key="userAccount">
				<Label>
					Select which account address you'd like to use
				</Label>
				<Dropdown
					placeholder="Select account address"
					fluid
					search
					selection
					options={this.createDropdownItems()}
					onChange={this.handleChange('userAddress')}
				/>
			</Form.Field>
		)

		const informationSegment = (
			<Segment.Group required key="infoSegment">
				{this.props.generatedForm ? [...this.props.generatedForm] : ''}
			</Segment.Group>
		)

		return (
			<Segment>
				<Header as="h1"> User Information </Header>
				<Segment
					loading={!this.props.accounts || this.state.loading}
					onSubmit={this.handleSubmit}
				>
					{[accountAddressFormField, informationSegment]}
				</Segment>
			</Segment>
		)
	}
}
export default withDefaultInfo(EndUser, segmentGeneratorFields)
