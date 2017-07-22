import React, { Component } from 'react'
import propTypes from 'prop-types'
export default class PromoTixForm extends Component {
	static propTypes = {
		queryTix: propTypes.func,
		setTixVals: propTypes.func,
		tixPrice: propTypes.string,
		tixQuantity: propTypes.string
	}
	render() {
		return (
			<form
				className="pure-form pure-form-stacked"
				onSubmit={this.props.queryTix}
			>
				<fieldset className="pure-group">
					<label htmlFor="tixType"> Tix Type</label>
					<input
						type="text"
						id="tixType"
						className="pure-input-3-4"
						onChange={this.props.setTixVals('tixType')}
					/>
					<label htmlFor="tixPrice"> Tix Price </label>
					<input
						type="text"
						id="tixPrice"
						className="pure-input-3-4"
						value={this.props.tixPrice}
						readOnly
					/>
					<label htmlFor="tixQuantity"> Tix Quantity </label>
					<input
						type="text"
						id="tixQuantity"
						className="pure-input-3-4"
						value={this.props.tixQuantity}
						readOnly
					/>
					<br />
					<button type="submit" className="pure-button pure-button-primary">
						{' '}Submit{' '}
					</button>
				</fieldset>
			</form>
		)
	}
}
