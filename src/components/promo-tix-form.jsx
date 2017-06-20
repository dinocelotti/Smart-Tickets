import React, { Component } from 'react';
import PT from 'prop-types';

export default class PromoTixForm extends Component {
	render() {
		return (
			<form className="pure-form pure-form-stacked" onSubmit={this.props.createTixs}>
				<fieldset className="pure-group">
					<label htmlFor="tixsLeft"> Remaining tixs left </label>
					<input type="text" id="tixsLeft" className="pure-input-3-4" value={this.props.tixsLeft} readOnly />
					<label htmlFor="tixType"> Tix Type</label>
					<input
						type="text"
						id="tixType"
						className="pure-input-3-4"
						onChange={this.props.setTixVals.bind(this, 'tixType')}
					/>
					<label htmlFor="tixPrice"> Tix Price </label>
					<input
						type="text"
						id="tixPrice"
						className="pure-input-3-4"
						onChange={this.props.setTixVals.bind(this, 'tixPrice')}
					/>
					<label htmlFor="tixQuantity"> Tix Quantity </label>
					<input
						type="text"
						id="tixQuantity"
						className="pure-input-3-4"
						onChange={this.props.setTixVals.bind(this, 'tixQuantity')}
					/>
					<br />
					<button type="submit" className="pure-button pure-button-primary">
						{' '}Submit{' '}
					</button>
				</fieldset>
			</form>
		);
	}
}
PromoTixForm.propTypes = {
	createTixs: PT.func.isRequired,
	tixsLeft: PT.func.isRequired,
	setTixVals: PT.func.isRequired
};