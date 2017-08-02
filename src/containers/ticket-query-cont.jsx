import TicketQueryForm from './../components/ticket-query-form'
import React, { Component } from 'react'
import propTypes from 'prop-types'
export default class TicketQueryFormCont extends Component {
	static propTypes = {
		promoterInstance: propTypes.object
	}

	state = {
		ticketType: '',
		ticketQuantity: '',
		ticketPrice: ''
	}

	isEmpObj(obj) {
		return Object.keys(obj).length === 0 && obj.constructor === Object
	}

	//takes an obj
	setStateAsync = state =>
		new Promise(res => {
			this.setState(state, res)
		})

	setTicketVals = name => e =>
		this.setState({
			[name]: e.target.value
		})

	queryTicket = async e => {
		e.preventDefault()
		const { promoterInstance } = this.props
		//check object exists
		if (this.isEmpObj(promoterInstance)) return
		const queryResult = await promoterInstance.getTicketVals(
			this.state.ticketType
		)
		console.log(queryResult)
		this.setStateAsync(queryResult)
	}
	render() {
		return (
			<TicketQueryForm
				ticketPrice={this.state.ticketPrice}
				ticketQuantity={this.state.ticketQuantity}
				queryTicket={this.queryTicket}
				setTicketVals={this.setTicketVals}
			/>
		)
	}
}
