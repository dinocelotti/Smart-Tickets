import React from 'react'
import propTypes from 'prop-types'
export class PromoterSection extends React.Component {
	static propTypes = {
		createProject: propTypes.func,
		setProjectVals: propTypes.func,
		accounts: propTypes.array
	}
	render() {
		return (
			<form
				className="pure-form pure-form-stacked"
				onSubmit={this.props.createProject}
			>
				<legend> A Project Creation Form</legend>
				<fieldset className="pure-group">
					<label htmlFor="projectName"> Project Name </label>
					<input
						id="projectName"
						type="text"
						placeholder="Project Name"
						className="pure-input-3-4"
						onChange={this.props.setProjectVals('projectName')}
					/>

					<label htmlFor="totalTickets"> Total Number of Tickets </label>
					<input
						id="totalTickets"
						type="text"
						placeholder="Total number of tickets"
						className="pure-input-3-4"
						onChange={this.props.setProjectVals('totalTickets')}
					/>

					<label htmlFor="consumerMaxTickets">
						{' '}Ticket Buy Limit for Consumers
					</label>
					<input
						id="consumerMaxTickets"
						type="text"
						placeholder="Ticket buy limit for consumers"
						className="pure-input-3-4"
						onChange={this.props.setProjectVals('consumerMaxTickets')}
					/>

					<label htmlFor="promoterAddress">
						Wallet Address to Set as the Promoter for this Project
					</label>
					<select
						id="promoterAddress"
						className="pure-input-3-4"
						onChange={this.props.setProjectVals('promoterAddress')}
					>
						{this.props.accounts.map(address =>
							<option key={address}>
								{address}
							</option>
						)}
					</select>
					<br />
					<button type="submit" className="pure-button pure-button-primary">
						{' '}Create Project{' '}
					</button>
				</fieldset>
			</form>
		)
	}
}
