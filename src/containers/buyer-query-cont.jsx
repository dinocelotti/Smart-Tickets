import BuyerQueryForm from './../components/buyer-query-form'
import React, { Component } from 'react'
import propTypes from 'prop-types'
export default class BuyerQueryCont extends Component {
	static propTypes = {
		promoterInstance: propTypes.object
	}
	state = {
		buyerAddress: '',
		ticketType: '',
		distributorFee: '',
		distributorAllottedQuantity: '',
		isDistributor: 'false',
		promoterFee: ''
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

	setBuyerVals = name => e => {
		this.setState({
			[name]: e.target.value
		})
	}

	queryBuyer = async e => {
		e.preventDefault()
		if (this.isEmpObj(this.props.promoterInstance)) return
		const [
			isDistributor,
			distributorAllottedQuantity,
			distributorFee,
			promoterFee
		] = await this.props.promoterInstance.queryBuyer(this.state)
		await this.setStateAsync({
			isDistributor: `${isDistributor}`, //cast into string
			distributorAllottedQuantity,
			distributorFee,
			promoterFee
		})
	}
	render() {
		return (
			<BuyerQueryForm
				queryBuyer={this.queryBuyer}
				setBuyerVals={this.setBuyerVals}
				distributorFee={this.state.distributorFee}
				promoterFee={this.state.promoterFee}
				distributorAllottedQuantity={this.state.distributorAllottedQuantity}
				isDistributor={this.state.isDistributor}
			/>
		)
	}
}
