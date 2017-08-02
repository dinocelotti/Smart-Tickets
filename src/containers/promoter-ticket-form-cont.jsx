import PromoterTicketForm from './../components/promoter-ticket-form'
import React, { Component } from 'react'
import propTypes from 'prop-types'
export default class PromoterTicketFormCont extends Component {
	static propTypes = {
		promoterInstance: propTypes.object
	}
	state = {
		ticketQuantity: '',
		ticketPrice: '',
		ticketType: '',
		ticketsLeft: '0'
	}

	isEmpObj(obj) {
		return Object.keys(obj).length === 0 && obj.constructor === Object
	}

	//takes an obj
	setStateAsync(state) {
		return new Promise(res => {
			this.setState(state, res)
		})
	}

	async componentWillReceiveProps({ promoterInstance }) {
		if (this.isEmpObj(promoterInstance)) return

		const ticketsLeft = await promoterInstance.getTicketsLeft()
		await this.setTicketsLeft(ticketsLeft)
	}
	setTicketsLeft = async ticketsLeft =>
		await this.setStateAsync({ ticketsLeft })

	setTicketVals = name => e =>
		this.setState({
			[name]: e.target.value
		})

	createTickets = async e => {
		e.preventDefault()
		console.log('create tickets called')
		const res = await this.props.promoterInstance.handleTicketForm(this.state)
		console.log(res)
		const ticketsLeft = await this.props.promoterInstance.getTicketsLeft()
		await this.setTicketsLeft(ticketsLeft)
	}

	render() {
		return (
			<PromoterTicketForm
				ticketsLeft={this.state.ticketsLeft}
				createTickets={this.createTickets}
				setTicketVals={this.setTicketVals}
			/>
		)
	}
}
