import React, { Component } from 'react'
import { List, Table, Accordion, Icon } from 'semantic-ui-react'
import camelToHuman from 'src/util/stringUtils'

export default class TicketTable extends Component {
	distributorBreakdownPerTicket = (distributors, ticketId) => {
		const { ticketsByDistributor } = this.props.distributorState

		const distributorBreakdown = distributors.reduce(
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

		return distributorBreakdown
	}

	userBreakdownPerTicket = (ticketHolders, ticketId) => {
		const accountState = this.props.accounts.byId

		const userBreakdown = ticketHolders.reduce(
			(ticketBreakdown, currentTicketHolder) => {
				if (!accountState[currentTicketHolder].tickets[ticketId])
					return ticketBreakdown

				const ticketToCheck =
					accountState[currentTicketHolder].tickets[ticketId]

				const breakdownToAdd = {
					user: currentTicketHolder,
					ticketBreakdown: ticketToCheck
				}

				return ticketToCheck
					? [...ticketBreakdown, breakdownToAdd]
					: ticketBreakdown
			},
			[]
		)
		return userBreakdown
	}

	createDistributorBreakdownItems = (type, breakdown) => {
		var breakdownDOM
		if (breakdown.length === 0) return
		else if (breakdown[0].distributor) {
			breakdownDOM = breakdown.map(({ distributor, ticketBreakdown }) => (
				<List.Item key={`${type}-breakdown-${distributor}`}>
					{distributor.split('_')[0]}
					<List.List>
						{Object.keys(ticketBreakdown).map((breakdownParam, index) => (
							<List.Item key={index}>
								{camelToHuman(breakdownParam)}:{' '}
								{ticketBreakdown[breakdownParam]}
							</List.Item>
						))}
					</List.List>
				</List.Item>
			))
		} else if (breakdown[0].user) {
			breakdownDOM = breakdown.map(({ user, ticketBreakdown }) => (
				<List.Item key={`${type}-breakdown-${user}`}>
					{user}
					<List.List>
						{Object.keys(ticketBreakdown).map((breakdownParam, index) => (
							<List.Item key={index}>
								{camelToHuman(breakdownParam)}:{' '}
								{ticketBreakdown[breakdownParam]}
							</List.Item>
						))}
					</List.List>
				</List.Item>
			))
		}
	}

	createDistributorBreakdown = (type, breakdown) =>
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

	createUserBreakdown = (type, breakdown) =>
		breakdown.map(({ user, ticketBreakdown }) => (
			<List.Item key={`${type}-breakdown-${user}`}>
				{user}
				<List.List>
					{Object.keys(ticketBreakdown).map((breakdownParam, index) => (
						<List.Item key={index}>
							{camelToHuman(breakdownParam)}: {ticketBreakdown[breakdownParam]}
						</List.Item>
					))}
				</List.List>
			</List.Item>
		))

	createBreakdownAccordion = (type, breakdown, name, breakdownType) => (
		<Accordion>
			<Accordion.Title>
				<Icon name="dropdown" />
				{name}
			</Accordion.Title>
			<Accordion.Content>
				<List>
					{breakdownType === 'distributor'
						? this.createDistributorBreakdown(type, breakdown)
						: this.createUserBreakdown(type, breakdown)}
				</List>
			</Accordion.Content>
		</Accordion>
	)

	createTicketTable = ({ tickets, distributors, ticketHolders }) => {
		const createCell = (key, content) => ({ key, content })
		const createKey = prefix => rest => `${prefix}${rest ? `-${rest}` : ''}`
		const { byId: ticketsById } = this.props.ticketState

		const headerRow = ['Type', 'Price in Wei', 'Quantity', 'Breakdown']

		const tableData = tickets.map(id => {
			const { typeOfTicket: type, price, quantity } = ticketsById[id]
			const distributorBreakdown = this.distributorBreakdownPerTicket(
				distributors,
				id
			)
			const userBreakdown = this.userBreakdownPerTicket(ticketHolders, id)
			return { type, price, quantity, distributorBreakdown, userBreakdown }
		})

		const renderBodyRow = (
			{ type, price, quantity, distributorBreakdown, userBreakdown },
			i
		) => {
			const typeKey = createKey(type)
			const typeCell = createCell(typeKey(), type)
			const priceCell = createCell(typeKey('price'), price)
			const quantityCell = createCell(typeKey('quantity'), quantity)
			const distributorBreakdownCell = createCell(
				typeKey('distributorBreakdown'),
				this.createBreakdownAccordion(
					type,
					distributorBreakdown,
					'Distributor Breakdown',
					'distributor'
				)
			)
			const userBreakdownCell = createCell(
				typeKey('userBreakdown'),
				this.createBreakdownAccordion(
					type,
					userBreakdown,
					'Customer Breakdown',
					'customer'
				)
			)

			return {
				key: type || `row-${i}`,
				cells: [
					typeCell,
					priceCell,
					quantityCell,
					distributorBreakdown ? distributorBreakdownCell : 'none',
					userBreakdown ? userBreakdownCell : 'none'
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
