import { PromoSection } from './../components/promo-section'
import React from 'react'
import { connect } from 'react-redux'
import * as projApi from '../api/proj-api'
import Distrib from './promo-distrib-cont'
import TixForm from './promo-tix-form-cont'
import TixQuery from './tix-query-cont'
import BuyerQuery from './buyer-query-cont'
import propTypes from 'prop-types'
class PromoSectionCont extends React.Component {
	static propTypes = {
		accts: propTypes.array,
		projs: propTypes.array,
		projsByAddr: propTypes.object
	}
	state = {
		projName: '',
		totalTixs: '',
		consumMaxTixs: '',
		promoAddr: '',
		projAddr: '',
		promoInstance: {}
	}
	//takes an obj
	setStateAsync(state) {
		return new Promise(res => {
			this.setState(state, res)
		})
	}

	setProjVals = (name, e) =>
		this.setState({
			[name]: e.target.value
		})

	setProjAddr = async e => {
		const projAddr = e.target.value
		await this.setStateAsync({ projAddr })
		await this.setPromoInstance()
	}

	setPromoAddr = async e => {
		const promoAddr = e.target.value
		await this.setStateAsync({ promoAddr })
		await this.setPromoInstance()
	}
	isEmpObj(obj) {
		return Object.keys(obj).length === 0 && obj.constructor === Object
	}

	samePromoInstance(prevInstance, newInstance) {
		return (
			prevInstance.projAddr === newInstance.projAddr &&
			prevInstance.promoAddr === newInstance.promoAddr
		)
	}

	async setPromoInstance() {
		const { promoAddr, projAddr } = this.state
		//check to see if both fields are set
		if (promoAddr.length === 0 || projAddr.length === 0) return

		const prevInstance = this.state.promoInstance
		if (
			!this.isEmpObj(prevInstance) &&
			this.samePromoInstance(prevInstance, { promoAddr, projAddr })
		)
			return

		const promoInstance = new projApi.Promo(promoAddr, projAddr)
		await promoInstance.init()
		await this.setStateAsync({ promoInstance })
	}

	async componentWillReceiveProps({ projs, projsByAddr, accts }) {
		if (projs.length > 0) {
			const defaultProj = projsByAddr[projs[0]]
			await this.setProjAddr(this.mockTarget(defaultProj.addr))
			//check if current owners addrs is the promo of the current proj
			if (accts.includes(defaultProj.promoAddr)) {
				await this.setPromoAddr(this.mockTarget(defaultProj.promoAddr))
			}
		}
	}

	createProj = e => {
		e.preventDefault()
		const projVals = this.state

		if (!projVals.promoAddr) {
			projVals.promoAddr = this.props.accts[0]
		}

		projApi.createProj(projVals)
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
				<PromoSection
					setProjVals={this.setProjVals}
					createProj={this.createProj}
					createdProj={this.props.projs}
					accts={this.props.accts}
				/>
				<form className="pure-form pure-form-stacked">
					<legend> Promo Contract Interaction </legend>
					<label htmlFor="promoAddr"> Promo Addr to use</label>
					<select id="promoAddr" onChange={this.setPromoAddr}>
						{this.props.accts.map(addr => {
							return this.props.projs.map(projAddr => {
								if (
									addr === this.props.projsByAddr[projAddr].promo &&
									this.state.projAddr === projAddr
								) {
									return (
										<option key={addr}>
											{addr}
										</option>
									)
								}
								return null
							})
						})}
					</select>
					<label htmlFor="projAddr"> Contract Addr to interact with</label>
					<select id="projAddr" onChange={this.setProjAddr}>
						{this.props.projs.map(projAddr =>
							<option key={projAddr}>
								{projAddr}
							</option>
						)}
					</select>
					<br />
				</form>
				<div className="pure-u-1-4">
					<Distrib promoInstance={this.state.promoInstance} />
				</div>
				<div className="pure-u-1-4">
					<BuyerQuery promoInstance={this.state.promoInstance} />
				</div>
				<div className="pure-u-1-4">
					<TixForm promoInstance={this.state.promoInstance} />
				</div>
				<div className="pure-u-1-4">
					<TixQuery promoInstance={this.state.promoInstance} />
				</div>
			</div>
		)
	}
}

function mapStateToProps({ projState, acctState }) {
	return {
		projs: projState.ids,
		projsByAddr: projState.byId,
		accts: acctState.ids
	}
}
export default connect(mapStateToProps)(PromoSectionCont)
