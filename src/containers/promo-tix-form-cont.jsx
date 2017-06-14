import PromoTixForm from './../views/promo-tix-form';
import React, { Component } from 'react';
import accTypes from '../prop-types/accts';
export default class PromoTixFormCont extends Component {
	constructor(props) {
		super(props);

		this.state = {
			/**
         * Tixs
         */
			tixQuantity: '',
			tixPrice: '',
			tixType: '',
			tixsLeft: 0
		};

		this.setTixVals = this.setTixVals.bind(this);
		this.setTixsLeft = this.setTixsLeft.bind(this);
		this.createTixs = this.createTixs.bind(this);
	}

	isEmpObj(obj) {
		return Object.keys(obj).length === 0 && obj.constructor === Object;
	}

	//takes an obj
	setStateAsync(state) {
		return new Promise(res => {
			this.setState(state, res);
		});
	}

	async componentWillReceiveProps({ promoInstance }) {
		if (this.isEmpObj(promoInstance)) return;

		const tixsLeft = await promoInstance.getTixsLeft();
		await this.setTixsLeft(tixsLeft);
	}
	async setTixsLeft(tixsLeft) {
		await this.setStateAsync({ tixsLeft });
	}

	setTixVals(name, e) {
		this.setState({
			[name]: e.target.value
		});
	}

	async createTixs(e) {
		e.preventDefault();
		console.log('create tixs called');
		let res = await this.props.promoInstance.handleTixForm(this.state);
		console.log(res);
		const tixsLeft = await this.props.promoInstance.getTixsLeft();
		await this.setTixsLeft(tixsLeft);
	}

	render() {
		return <PromoTixForm tixsLeft={this.state.tixsLeft} createTixs={this.createTixs} setTixVals={this.setTixVals} />;
	}
}

PromoTixFormCont.propTypes = {
	promoInstance: accTypes.promoInstance
};
