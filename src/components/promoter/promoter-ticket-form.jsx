import React from 'react'
import propTypes from 'prop-types'
import FormTemplate from '../../util/formUtils'
import { Form, Button, Header, Segment } from 'semantic-ui-react'
import projectApi from '../../api/project-api'
const formFields = {
	ticketType: {},
	ticketPrice: {},
	ticketQuantity: {}
}
export default class PromoterTicketForm extends FormTemplate {
	handleSubmit = async () => {
		const { promoter, address } = this.props

		const promoterInstance = new projectApi.Promoter({ promoter, address })
		await promoterInstance.init()
		promoterInstance.handleTicketForm(this.state)
	}
	render() {
		return (
			<Segment>
				<Header as="h1"> Assign a ticket type for this project </Header>
				<Form onSubmit={this.handleSubmit}>
					{[...this.generateInputFormFields(formFields)]}
					<Button type="submit"> Submit </Button>
				</Form>
			</Segment>
		)
	}
}
