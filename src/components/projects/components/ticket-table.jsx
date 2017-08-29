import React, { Component } from 'react'
import { List, Table, Accordion, Icon } from 'semantic-ui-react'
import camelToHuman from 'src/util/stringUtils'

export default class TicketTable extends Component {
	distributorBreakdownPerTicket = (distributors, ticketId) => {
		const { ticketsByDistributor } = this.props.distributorState

		const breakdown = distributors.reduce(
			(ticketBreakdown, currentDistributor) => {
				const currentDistributorsTickets =
					ticketsByDistributor[currentDistributor]

				if (!currentDistributorsTickets) return ticketBreakdown

				const ticketToCheck = currentDistributorsTickets[ticketId]

				const breakdownToAdd = {
					distributor: currentDistributor,
					ticketBreakdown: ticketToCheck
				}

				return ticketToCheck
					? [...ticketBreakdown, breakdownToAdd]
					: ticketBreakdown
			},
			[]
		)

		return breakdown
	}
	createBreakdownListItems = (type, breakdown) =>
		breakdown.map(({ distributor, ticketBreakdown }) => (
			<List.Item key={`${type}-breakdown-${distributor}`}>
				{distributor.split('_')[0]}
				<List.List>
					{Object.keys(ticketBreakdown).map((breakdownParam, index) => (
						<List.Item key={index}>
							{camelToHuman(breakdownParam)}: {ticketBreakdown[breakdownParam]}
						</List.Item>
					))}
				</List.List>
			</List.Item>
		))

	createBreakdownAccordion = (type, breakdown) => (
		<Accordion>
			<Accordion.Title>
				<Icon name="dropdown" />
				Distributor Breakdown
			</Accordion.Title>
			<Accordion.Content>
				<List>{this.createBreakdownListItems(type, breakdown)}</List>
			</Accordion.Content>
		</Accordion>
	)

	createTicketTable = ({ tickets, distributors }) => {
		const createCell = (key, content) => ({ key, content })
		const createKey = prefix => rest => `${prefix}${rest ? `-${rest}` : ''}`
		const { byId: ticketsById } = this.props.ticketState

		const headerRow = ['Type', 'Price in Wei', 'Quantity', 'Breakdown']

		const tableData = tickets.map(id => {
			const { typeOfTicket: type, price, quantity } = ticketsById[id]
			const breakdown = this.distributorBreakdownPerTicket(distributors, id)
			return { type, price, quantity, breakdown }
		})

		const renderBodyRow = ({ type, price, quantity, breakdown }, i) => {
			const typeKey = createKey(type)
			const typeCell = createCell(typeKey(), type)
			const priceCell = createCell(typeKey('price'), price)
			const quantityCell = createCell(typeKey('quantity'), quantity)
			const breakdownCell = createCell(
				typeKey('breakdown'),
				this.createBreakdownAccordion(type, breakdown)
			)

			return {
				key: type || `row-${i}`,
				cells: [
					typeCell,
					priceCell,
					quantityCell,
					breakdown ? breakdownCell : 'none'
				]
			}
		}
		return (
			<Table
				basic="very"
				headerRow={headerRow}
				renderBodyRow={renderBodyRow}
				tableData={tableData}
			/>
		)
	}
	render() {
		return this.props.project.tickets.length > 0
			? this.createTicketTable(this.props.project)
			: null
	}
}
