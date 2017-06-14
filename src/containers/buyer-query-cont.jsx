import BuyerQueryForm from './../views/buyer-query-form';
import React, { Component } from 'react';
import accTypes from '../prop-types/accts';
export default class BuyerQueryCont extends Component {
	constructor(props) {
		super(props);

		this.state = {
			buyerAddr: '',
			tixType: '',
			distribFee: '',
			distribAllotQuan: '',
			isDistrib: 'false',
			promoFee: ''
		};

		this.setBuyerVals = this.setBuyerVals.bind(this);
		this.queryBuyer = this.queryBuyer.bind(this);
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

	setBuyerVals(name, e) {
		this.setState({
			[name]: e.target.value
		});
	}

	async queryBuyer(e) {
		e.preventDefault();
		if (this.isEmpObj(this.props.promoInstance)) return;
		const [isDistrib, distribAllotQuan, distribFee, promoFee] = await this.props.promoInstance.queryBuyer(this.state);
		await this.setStateAsync({
			isDistrib,
			distribAllotQuan,
			distribFee,
			promoFee
		});
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
		);
	}
}

BuyerQueryCont.propTypes = {
	promoInstance: accTypes.promoInstance
};
