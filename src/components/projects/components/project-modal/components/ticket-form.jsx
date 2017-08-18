import React, { Component } from 'react'
import propTypes from 'prop-types'
import withDefaultForm from 'src/util/withDefaultForm'
import { Form, Button, Header, Segment } from 'semantic-ui-react'
import projectApi from 'src/api/project-api'
const formGeneratorFields = {
	ticketType: {},
	ticketPrice: {},
	ticketQuantity: {}
}
class PromoterTicketForm extends Component {
	handleSubmit = async () => {
		const { promoter, address } = this.props

		const promoterInstance = new projectApi.Promoter({ promoter, address })
		await promoterInstance.init()
		promoterInstance.handleTicketForm(this.props.data)
	}
	render() {
		return (
			<Segment>
				<Header as="h1"> Assign a ticket type for this project </Header>
				<Form onSubmit={this.handleSubmit}>
					{[...this.props.generatedForm]}
					<Button type="submit"> Submit </Button>
				</Form>
			</Segment>
		)
	}
}

export default withDefaultForm(PromoterTicketForm, formGeneratorFields)
