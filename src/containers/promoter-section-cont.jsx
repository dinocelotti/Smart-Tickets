import { PromoterSection } from './../components/promoter-section'
import React from 'react'
import { connect } from 'react-redux'
import projectApi from '../api/project-api'
import Distributor from './promoter-distributor-cont'
import TicketForm from './promoter-ticket-form-cont'
import TicketQuery from './ticket-query-cont'
import BuyerQuery from './buyer-query-cont'
import propTypes from 'prop-types'
class PromoterSectionCont extends React.Component {
	static propTypes = {
		accounts: propTypes.array,
		projects: propTypes.array,
		projectsByAddress: propTypes.object
	}
	state = {
		projectName: '',
		totalTickets: '',
		consumerMaxTickets: '',
		promoterAddress: '',
		projectAddress: '',
		promoterInstance: {}
	}
	//takes an obj
	setStateAsync(state) {
		return new Promise(res => {
			this.setState(state, res)
		})
	}

	setProjectVals = name => e =>
		this.setState({
			[name]: e.target.value
		})

	setProjectAddress = async e => {
		const projectAddress = e.target.value
		try {
			await this.setStateAsync({ projectAddress })
			await this.setPromoterInstance()
		} catch (e) {
			console.error(e)
		}
	}

	setPromoterAddress = async e => {
		const promoterAddress = e.target.value
		await this.setStateAsync({ promoterAddress })
		await this.setPromoterInstance()
	}
	isEmpObj(obj) {
		return Object.keys(obj).length === 0 && obj.constructor === Object
	}

	samePromoterInstance(prevInstance, newInstance) {
		return (
			prevInstance.projectAddress === newInstance.projectAddress &&
			prevInstance.promoterAddress === newInstance.promoterAddress
		)
	}

	async setPromoterInstance() {
		const { promoterAddress, projectAddress } = this.state
		//check to see if both fields are set
		if (promoterAddress.length === 0 || projectAddress.length === 0) return

		const prevInstance = this.state.promoterInstance
		if (
			!this.isEmpObj(prevInstance) &&
			this.samePromoterInstance(prevInstance, {
				promoterAddress,
				projectAddress
			})
		)
			return

		const promoterInstance = new projectApi.Promoter({
			promoter: promoterAddress,
			address: projectAddress
		})
		await promoterInstance.init()
		await this.setStateAsync({ promoterInstance })
	}

	async componentWillReceiveProps({ projects, projectsByAddress, accounts }) {
		if (projects.length > 0) {
			const defaultProject = projectsByAddress[projects[0]]
			await this.setProjectAddress(this.mockTarget(defaultProject.address))
			//check if current owners addresss is the promoter of the current project
			if (accounts.includes(defaultProject.promoter)) {
				await this.setPromoterAddress(this.mockTarget(defaultProject.promoter))
			}
		}
	}

	createProject = e => {
		e.preventDefault()
		const projectVals = this.state

		if (!projectVals.promoterAddress) {
			projectVals.promoterAddress = this.props.accounts[0]
		}

		projectApi.createProject(projectVals)
	}

	mockTarget(value) {
		return {
			target: {
				value
			}
		}
	}

	render() {
		return (
			<div>
				<PromoterSection
					setProjectVals={this.setProjectVals}
					createProject={this.createProject}
					createdProject={this.props.projects}
					accounts={this.props.accounts}
				/>
				<form className="pure-form pure-form-stacked">
					<legend> Promoter Contract Interaction </legend>
					<label htmlFor="promoterAddress"> Promoter Address to use</label>
					<select id="promoterAddress" onChange={this.setPromoterAddress}>
						{this.props.accounts.map(address => {
							return this.props.projects.map(projectAddress => {
								if (
									address ===
										this.props.projectsByAddress[projectAddress].promoter &&
									this.state.projectAddress === projectAddress
								) {
									return (
										<option key={address}>
											{address}
										</option>
									)
								}
								return null
							})
						})}
					</select>
					<label htmlFor="projectAddress">
						{' '}Contract Address to interact with
					</label>
					<select id="projectAddress" onChange={this.setProjectAddress}>
						{this.props.projects.map(projectAddress =>
							<option key={projectAddress}>
								{projectAddress}
							</option>
						)}
					</select>
					<br />
				</form>
				<div className="pure-u-1-4">
					<TicketForm promoterInstance={this.state.promoterInstance} />
				</div>
				<div className="pure-u-1-4">
					<Distributor promoterInstance={this.state.promoterInstance} />
				</div>
				<div className="pure-u-1-4">
					<TicketQuery promoterInstance={this.state.promoterInstance} />
				</div>
				<div className="pure-u-1-4">
					<BuyerQuery promoterInstance={this.state.promoterInstance} />
				</div>
			</div>
		)
	}
}

function mapStateToProps({ projectState, accountState }) {
	return {
		projects: projectState.ids,
		projectsByAddress: projectState.byId,
		accounts: accountState.ids
	}
}
export default connect(mapStateToProps)(PromoterSectionCont)
