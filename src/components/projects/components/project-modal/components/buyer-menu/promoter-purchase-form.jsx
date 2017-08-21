import React, { Component } from 'react'
import propTypes from 'prop-types'
import projectApi from 'src/api/project-api'
import withDefaultForm from 'src/util/withDefaultForm'

import { Form, Dropdown, Button, Header, Segment, Input } from 'semantic-ui-react'
const formGeneratorFields = {
	ticketQuantity: {},
}
class DistributorForm extends Component {
	handleChange = this.props.handleChange
	state = { buyerAddress: '' }

	createDropdownItems() {
		return this.props.accounts.ids.map(id => ({
			value: id,
			text: id
		}))
	}
	createDropDownTickets() {
		console.log(this.props.tickets)

		return this.props.tickets.map(id => ({
			value: id.split('_')[0],
			text: id.split('_')[0]
		}))
	}
	calculateTicketCost() {
		const { ticketType, ticketQuantity } = this.state 
		const { ticketState } = this.props
		const ticketPrice = ticketState.byId[ticketType].price 
		return ticketPrice * ticketQuantity
	}
	handleSubmit = async () => {
		const { address, isDistributor } = this.props
		const { buyerAddress, ticketType, ticketQuantity } = this.state
		const buyerInstance = new projectApi.Buyer({ buyerAddress, projectAddress: address, isDistributor })
		await buyerInstance.init()
		buyerInstance.buyTicketFromPromoter({ticketType, ticketQuantity, txObj: {value: this.calculateTicketCost()} })
	}
	render() {
		const accountAddressFormField = (
			<Form.Field required key="buyerAddress">
				<Segment>
					<Header as="h3" content="Address to buy the tickets from" />
					<Dropdown
						placeholder="Select your address"
						fluid
						search
						selection
						options={this.createDropdownItems()}
						onChange={this.handleChange('buyerAddress')}
					/>
				</Segment>
			</Form.Field>
		)
		const ticketTypeDropDown = (
			<Form.Field key="ticketTypeDropDown">
				<Dropdown
					placeholder="Select ticket type to buy "
					fluid
					search
					selection
					options={this.createDropDownTickets()}
					onChange={this.handleChange('ticketType')}
				/>
			</Form.Field>
		)
		const ticketCost = (
			<Form.Field> 
				<Input disabled label="Ticket cost:" value={this.calculateTicketCost()}> </Input>
			</Form.Field>
		)
		return (
			<Segment>
				<Form
					loading={!this.props.accounts || this.state.loading}
					onSubmit={this.handleSubmit}
				>
					{accountAddressFormField}
					{ticketTypeDropDown}
					{...this.props.generatedForm}	
					{ticketCost}
					<Button type="submit"> Submit </Button>
				</Form>
			</Segment>
		)
	}
}

export default withDefaultForm (DistributorForm, formGeneratorFields)
