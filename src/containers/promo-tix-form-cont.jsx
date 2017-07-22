import PromoTixForm from './../components/promo-tix-form'
import React, { Component } from 'react'
import propTypes from 'prop-types'
export default class PromoTixFormCont extends Component {
	static propTypes = {
		promoInstance: propTypes.object
	}
	state = {
		tixQuantity: '',
		tixPrice: '',
		tixType: '',
		tixsLeft: '0'
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

	async componentWillReceiveProps({ promoInstance }) {
		if (this.isEmpObj(promoInstance)) return

		const tixsLeft = await promoInstance.getTixsLeft()
		await this.setTixsLeft(tixsLeft)
	}
	setTixsLeft = async tixsLeft => await this.setStateAsync({ tixsLeft })

	setTixVals = (name, e) =>
		this.setState({
			[name]: e.target.value
		})

	createTixs = async e => {
		e.preventDefault()
		console.log('create tixs called')
		const res = await this.props.promoInstance.handleTixForm(this.state)
		console.log(res)
		const tixsLeft = await this.props.promoInstance.getTixsLeft()
		await this.setTixsLeft(tixsLeft)
	}

	render() {
		return (
			<PromoTixForm
				tixsLeft={this.state.tixsLeft}
				createTixs={this.createTixs}
				setTixVals={this.setTixVals}
			/>
		)
	}
}
