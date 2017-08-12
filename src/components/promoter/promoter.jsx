import React from 'react'
import {
	Form,
	Dropdown,
	Button,
	Header,
	Label,
	Segment
} from 'semantic-ui-react'
import propTypes from 'prop-types'
import FormTemplate from '../../util/formUtils'
import projectApi from '../../api/project-api'
const formFields = {
	projectName: {},
	totalTickets: {},
	consumerMaxTickets: {}
}
export default class Promoter extends FormTemplate {
	static propTypes = {
		accounts: propTypes.object
	}
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
		await projectApi.createProject(this.state)
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
					{[
						accountAddressFormField,
						...this.generateInputFormFields(formFields)
					]}
					<Button type="submit"> Submit </Button>
				</Form>
			</Segment>
		)
	}
}
