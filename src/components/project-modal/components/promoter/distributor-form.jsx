import React, { Component } from 'react'
import propTypes from 'prop-types'
import withDefaultForm from 'src/util/withDefaultForm'
import projectApi from 'src/api/project-api'

import { Form, Dropdown, Button, Header, Segment } from 'semantic-ui-react'
const formGeneratorFields = {
	distributorAllottedQuantity: {},
	ticketType: {},
	promoterFee: {}
}
class PromoterDistributorForm extends Component {
	handleChange = this.props.handleChange
	state = { distributorAddress: '' }

	createDropdownItems() {
		return this.props.accounts.ids.map(id => ({
			value: id,
			text: id
		}))
	}

	handleSubmit = async () => {
		const { promoter, address } = this.props

		const promoterInstance = new projectApi.Promoter({ promoter, address })
		await promoterInstance.init()
		promoterInstance.handleDistributorForm(this.props.data)
	}
	render() {
		const accountAddressFormField = (
			<Form.Field required key="distributorAddress">
				<Segment>
					<Header
						as="h3"
						content="Distributor white-list: enter manually or choose from the drop down"
					/>
					<Form.Group widths="equal">
						<Form.Input
							placeholder="Manually enter distributor address"
							onChange={this.handleChange('distributorAddress')}
							value={
								(this.props.data && this.props.data.distributorAddress) || ''
							}
						/>
						<Dropdown
							placeholder="Select distributor address from your own accounts"
							fluid
							search
							selection
							options={this.createDropdownItems()}
							onChange={this.handleChange('distributorAddress')}
						/>
					</Form.Group>
				</Segment>
			</Form.Field>
		)

		return (
			<Segment>
				<h1> Assign a distributor to be whitelisted </h1>
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

export default withDefaultForm(PromoterDistributorForm, formGeneratorFields)
