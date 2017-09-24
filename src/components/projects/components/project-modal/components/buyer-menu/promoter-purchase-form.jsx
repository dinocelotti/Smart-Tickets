import React, { Component } from 'react'
import propTypes from 'prop-types'
import projectApi from 'src/api/project-api'
import withDefaultForm from 'src/util/withDefaultForm'

import { Form, Dropdown, Button, Segment, Input } from 'semantic-ui-react'
const formGeneratorFields = {
	ticketQuantity: {}
}
class PromoterForm extends Component {
	handleChange = this.props.handleChange
	state = { buyerAddress: '', ticketCost: 0 }

	createDropdownItems() {
		return this.props.accounts.ids.map(id => ({
			value: id,
			text: id
		}))
	}
	createDropDownTickets() {
		return this.props.project.tickets.map(id => ({
			value: id,
			text: id.split('_')[0]
		}))
	}

	calculateTicketCost(
		{ ticketState, data: { ticketType = null, ticketQuantity = 0 } } = {}
	) {
		if (!ticketType) return ''

		const ticketPrice = ticketState.byId[ticketType].price
		return this.setState(() => ({ ticketCost: +ticketPrice * +ticketQuantity }))
	}

	handleSubmit = async () => {
		const { address, isDistributor } = this.props
		const buyerAddress = this.props.data.buyerAddress
		const ticketType = this.props.data.ticketType
		const ticketQuantity = parseInt(this.props.data.ticketQuantity)
		const buyerInstance = new projectApi.Buyer({
			buyerAddress,
			projectAddress: address,
			isDistributor
		})
		await buyerInstance.init()
		console.log(
			'ticket type',
			ticketType.split('_')[0],
			typeof ticketType.split('_')[0]
		)
		buyerInstance.buyTicketFromPromoter({
			ticketType: ticketType.split('_')[0],
			ticketQuantity,
			txObj: { value: this.state.ticketCost }
		})
	}

	componentWillReceiveProps(nextProps) {
		this.calculateTicketCost(nextProps)
	}

	render() {
		const accountAddressFormField = (
			<Form.Field required key="buyerAddress">
				<Dropdown
					placeholder="Select your address"
					fluid
					search
					selection
					options={this.createDropdownItems()}
					onChange={this.handleChange('buyerAddress')}
				/>
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
				<Input disabled label="Ticket cost:" value={this.state.ticketCost} />
			</Form.Field>
		)
		return (
			<Segment>
				<Form
					loading={!this.props.accounts || this.state.loading}
					onSubmit={this.handleSubmit}
				>
					{accountAddressFormField}
					{console.log(this.props)} {ticketTypeDropDown}
					{this.props.generatedForm}
					{ticketCost}
					<Button type="submit"> Submit </Button>
				</Form>
			</Segment>
		)
	}
}

export default withDefaultForm(PromoterForm, formGeneratorFields)
