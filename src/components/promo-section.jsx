import React from 'react';
import PT from 'prop-types';
import accTypes from '../prop-types/accts';
export class PromoSection extends React.Component {
	render() {
		return (
			<form className="pure-form pure-form-stacked" onSubmit={this.props.createProj}>

				<legend> An Proj Creation Form</legend>
				<fieldset className="pure-group">
					<label htmlFor="projName"> Proj Name </label>
					<input
						id="projName"
						type="text"
						placeholder="Proj Name"
						className="pure-input-3-4"
						onChange={this.props.setProjVals.bind(this, 'projName')}
					/>

					<label htmlFor="totalTixs"> Total number of tixs </label>
					<input
						id="totalTixs"
						type="text"
						placeholder="Total number of tixs"
						className="pure-input-3-4"
						onChange={this.props.setProjVals.bind(this, 'totalTixs')}
					/>

					<label htmlFor="consumMaxTixs">
						{' '}Tix buy limit for consums
					</label>
					<input
						id="consumMaxTixs"
						type="text"
						placeholder="Tix buy limit for consums"
						className="pure-input-3-4"
						onChange={this.props.setProjVals.bind(this, 'consumMaxTixs')}
					/>

					<label htmlFor="promoAddr"> Your wallet addr </label>
					<select id="promoAddr" className="pure-input-3-4" onChange={this.props.setProjVals.bind(this, 'promoAddr')}>
						{this.props.accts.map(addr => <option key={addr}>{addr}</option>)}
					</select>
					<br />
					<button type="submit" className="pure-button pure-button-primary">
						{' '}Create Proj{' '}
					</button>
				</fieldset>
			</form>
		);
	}
}
PromoSection.propTypes = {
	createProj: PT.func.isRequired,
	setProjVals: PT.func.isRequired,
	accts: accTypes.accts
};
