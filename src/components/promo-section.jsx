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
				<legend> A Project Creation Form</legend>
				<fieldset className="pure-group">
					<label htmlFor="projName"> Project Name </label>
					<input
						id="projName"
						type="text"
						placeholder="Proj Name"
						className="pure-input-3-4"
						onChange={this.props.setProjVals('projName')}
					/>

					<label htmlFor="totalTixs"> Total Number of Tickets </label>
					<input
						id="totalTixs"
						type="text"
						placeholder="Total number of tixs"
						className="pure-input-3-4"
						onChange={this.props.setProjVals('totalTixs')}
					/>

					<label htmlFor="consumMaxTixs"> Ticket Buy Limit for Consumers</label>
					<input
						id="consumMaxTixs"
						type="text"
						placeholder="Tix buy limit for consums"
						className="pure-input-3-4"
						onChange={this.props.setProjVals('consumMaxTixs')}
					/>

					<label htmlFor="promoAddr">
						Wallet Address to Set as the Promoter for this Project
					</label>
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
