import React from 'react'
import propTypes from 'prop-types'
export class PromoSection extends React.Component {
	static propTypes = {
		createProj: propTypes.func,
		setProjVals: propTypes.func,
		accts: propTypes.array
	}
	render() {
		return (
			<form
				className="pure-form pure-form-stacked"
				onSubmit={this.props.createProj}
			>
				<legend> An Proj Creation Form</legend>
				<fieldset className="pure-group">
					<label htmlFor="projName"> Proj Name </label>
					<input
						id="projName"
						type="text"
						placeholder="Proj Name"
						className="pure-input-3-4"
						onChange={this.props.setProjVals('projName')}
					/>

					<label htmlFor="totalTixs"> Total number of tixs </label>
					<input
						id="totalTixs"
						type="text"
						placeholder="Total number of tixs"
						className="pure-input-3-4"
						onChange={this.props.setProjVals('totalTixs')}
					/>

					<label htmlFor="consumMaxTixs"> Tix buy limit for consums</label>
					<input
						id="consumMaxTixs"
						type="text"
						placeholder="Tix buy limit for consums"
						className="pure-input-3-4"
						onChange={this.props.setProjVals('consumMaxTixs')}
					/>

					<label htmlFor="promoAddr"> Your wallet addr </label>
					<select
						id="promoAddr"
						className="pure-input-3-4"
						onChange={this.props.setProjVals('promoAddr')}
					>
						{this.props.accts.map(addr =>
							<option key={addr}>
								{addr}
							</option>
						)}
					</select>
					<br />
					<button type="submit" className="pure-button pure-button-primary">
						{' '}Create Proj{' '}
					</button>
				</fieldset>
			</form>
		)
	}
}
