import BuyerQueryForm from './../components/buyer-query-form'
import React, { Component } from 'react'
import propTypes from 'prop-types'
export default class BuyerQueryCont extends Component {
	static propTypes = {
		promoInstance: propTypes.object
	}
	state = {
		buyerAddr: '',
		tixType: '',
		distribFee: '',
		distribAllotQuan: '',
		isDistrib: 'false',
		promoFee: ''
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
		if (this.isEmpObj(this.props.promoInstance)) return
		const [
			isDistrib,
			distribAllotQuan,
			distribFee,
			promoFee
		] = await this.props.promoInstance.queryBuyer(this.state)
		await this.setStateAsync({
			isDistrib: `${isDistrib}`, //cast into string
			distribAllotQuan,
			distribFee,
			promoFee
		})
	}
	render() {
		return (
			<BuyerQueryForm
				queryBuyer={this.queryBuyer}
				setBuyerVals={this.setBuyerVals}
				distribFee={this.state.distribFee}
				promoFee={this.state.promoFee}
				distribAllotQuan={this.state.distribAllotQuan}
				isDistrib={this.state.isDistrib}
			/>
		)
	}
}
