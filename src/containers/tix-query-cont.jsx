import TixQueryForm from './../components/tix-query-form'
import React, { Component } from 'react'
import propTypes from 'prop-types'
export default class TixQueryFormCont extends Component {
	static propTypes = {
		promoInstance: propTypes.object
	}

	state = {
		tixType: '',
		tixQuantity: '',
		tixPrice: ''
	}

	isEmpObj(obj) {
		return Object.keys(obj).length === 0 && obj.constructor === Object
	}

	//takes an obj
	setStateAsync = state =>
		new Promise(res => {
			this.setState(state, res)
		})

	setTixVals = (name, e) =>
		this.setState({
			[name]: e.target.value
		})

	queryTix = async e => {
		e.preventDefault()
		const { promoInstance } = this.props
		//check object exists
		if (this.isEmpObj(promoInstance)) return
		const queryResult = await promoInstance.getTixVals(this.state.tixType)
		console.log(queryResult)
		this.setStateAsync(queryResult)
	}
	render() {
		return (
			<TixQueryForm
				tixPrice={this.state.tixPrice}
				tixQuantity={this.state.tixQuantity}
				queryTix={this.queryTix}
				setTixVals={this.setTixVals}
			/>
		)
	}
}
