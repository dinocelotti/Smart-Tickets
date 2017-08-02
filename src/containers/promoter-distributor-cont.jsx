import PromoterDistributorForm from './../components/promoter-distributor-form'
import React, { Component } from 'react'
import propTypes from 'prop-types'
export default class PromoterDistributorCont extends Component {
	static propTypes = {
		promoterInstance: propTypes.object
	}

	state = {
		distributorAddress: '',
		distributorAllottedQuantity: '',
		promoterFee: '',
		ticketType: ''
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

	setDistributorVals = name => e =>
		this.setState({
			[name]: e.target.value
		})

	createDistributor = e => {
		e.preventDefault()
		if (this.isEmpObj(this.props.promoterInstance)) return
		this.props.promoterInstance.handleDistributorForm(this.state)
	}
	render() {
		return (
			<PromoterDistributorForm
				createDistributor={this.createDistributor}
				setDistributorVals={this.setDistributorVals}
			/>
		)
	}
}
