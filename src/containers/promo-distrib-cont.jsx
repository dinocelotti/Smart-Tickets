import PromoDistribForm from './../components/promo-distrib-form'
import React, { Component } from 'react'
import propTypes from 'prop-types'
export default class PromoDistribCont extends Component {
	static propTypes = {
		promoInstance: propTypes.object
	}

	state = {
		distribAddr: '',
		distribAllotQuan: '',
		promoFee: '',
		tixType: ''
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

	setDistribVals = name => e =>
		this.setState({
			[name]: e.target.value
		})

	createDistrib = e => {
		e.preventDefault()
		if (this.isEmpObj(this.props.promoInstance)) return
		this.props.promoInstance.handleDistribForm(this.state)
	}
	render() {
		return (
			<PromoDistribForm
				createDistrib={this.createDistrib}
				setDistribVals={this.setDistribVals}
			/>
		)
	}
}
