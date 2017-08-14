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
import withDefaultForm from 'src/util/withDefaultForm'
const formGeneratorFields = {
	projectName: {},
	totalTickets: {},
	consumerMaxTickets: {}
}
class Promoter extends Component {
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
		await projectApi.createProject(this.props.data)
		this.setState(() => ({ loading: false }))
	}

	render() {
		const accountAddressFormField = (
			<Form.Field required key="promoterAccount">
				<Label>
					Select which account address you'd like to have as the promoter
				</Label>
				<Dropdown
					placeholder="Select account address"
					fluid
					search
					selection
					options={this.createDropdownItems()}
					onChange={this.handleChange('promoterAddress')}
				/>
			</Form.Field>
		)

		return (
			<Segment>
				<Header as="h1"> Create a project </Header>
				<Form
					loading={!this.props.accounts || this.state.loading}
					onSubmit={this.handleSubmit}
				>
					{[accountAddressFormField, ...this.props.generatedForm]}
					<Button type="submit"> Submit </Button>
				</Form>
			</Segment>
		)
	}
}
export default withDefaultForm(Promoter, formGeneratorFields)
