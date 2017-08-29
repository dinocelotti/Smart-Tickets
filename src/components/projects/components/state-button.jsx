import { Button, Popup } from 'semantic-ui-react'
import React, { Component } from 'react'
import projectApi from 'src/api/project-api'
const stateMap = {
	'Private Funding': 'finishStaging',
	'Public Funding': 'startPublicFunding'
}
export default class StateButton extends Component {
	handleOnClick = async () => {
		const { promoter, address, nextState, ticketsLeft } = this.props
		if (ticketsLeft !== '0') return
		const promoterInstance = new projectApi.Promoter({ promoter, address })
		await promoterInstance.init()
		const stateTransition = stateMap[nextState]
		promoterInstance[stateTransition]()
	}

	stateButton = () => (
		<Button onClick={this.handleOnClick}>
			{`Move to ${this.props.nextState}`}
		</Button>
	)

	ticketsLeftPopUp = ticketsLeft => (
		<Popup
			trigger={this.stateButton()}
			content={`There are still ${ticketsLeft} tickets left. You need to assign the whole pool of tickets before moving onto the next state`}
			on="click"
			position="top right"
		/>
	)
	render() {
		const { nextState, ticketsLeft } = this.props
		return ticketsLeft === '0' ? this.stateButton() : this.ticketsLeftPopUp()
	}
}
