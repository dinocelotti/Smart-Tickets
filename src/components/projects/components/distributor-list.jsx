import React, { Component } from 'react'
import { List, Table, Accordion, Icon } from 'semantic-ui-react'
import camelToHuman from 'src/util/stringUtils'
export default class DistributorList extends Component {
	formatTicketData(ticketsObj) {
		return Object.keys(ticketsObj).map(currentTicket => {
			const ticketType = currentTicket.split('_')[0]

			return { ticketType, ...ticketsObj[currentTicket] }
		})
	}
	createDistributorTable() {
		const headerRow = ['Distributor Address']
		const { distributors } = this.props.project
		const { byId, ids, ticketsByDistributor } = this.props.distributorState
		distributors.reduce((tableData, distributorId) => {
			const currentDistributor = byId[distributorId]
			const currentTickets = ticketsByDistributor[distributorId] || {}
			const obj = {
				distributor: currentDistributor.distributor,
				ticketValues: this.formatTicketData(currentTickets)
			}
		}, {})
	}
	render() {
		this.createDistributorTable()
		return null
	}
}
