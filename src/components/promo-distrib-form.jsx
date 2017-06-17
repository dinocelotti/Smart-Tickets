import React, { Component } from 'react';
import PT from 'prop-types';

export default class PromoDistribForm extends Component {
	render() {
		return (
			<form className="pure-form pure-form-stacked" onSubmit={this.props.createDistrib}>
				<label htmlFor="distribAddr"> Distrib Buyer Addr</label>
				<input
					type="text"
					id="distribAddr"
					onChange={this.props.setDistribVals.bind(this, 'distribAddr')}
					className="pure-input-3-4"
					placeholder="Buyer addr"
				/>
				<label htmlFor="distribAllotQuan"> Allotted Quantity </label>
				<input
					type="text"
					id="distribAllotQuan"
					onChange={this.props.setDistribVals.bind(this, 'distribAllotQuan')}
					className="pure-input-3-4"
					placeholder="Allotted Quantities"
				/>
				<label htmlFor="tixType"> Tix Type</label>
				<input
					type="text"
					id="tixType"
					className="pure-input-3-4"
					onChange={this.props.setDistribVals.bind(this, 'tixType')}
				/>
				<label htmlFor="distribFee"> Fee for Distrib Buyer </label>
				<input
					type="text"
					id="distribFee"
					onChange={this.props.setDistribVals.bind(this, 'distribFee')}
					className="pure-input-3-4"
					placeholder="Fee in Percent"
				/>
				<br />
				<button type="submit" className="pure-button pure-button-primary">
					{' '}Submit{' '}
				</button>
			</form>
		);
	}
}
PromoDistribForm.propTypes = {
	createDistrib: PT.func.isRequired,
	setDistribVals: PT.func.isRequired
};
