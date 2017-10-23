import React, { Component } from 'react'
import { Segment } from 'semantic-ui-react'
import camelToHuman from './stringUtils'
function withDefaultInfo(WrappedComponent, infoFields) {
	return class extends Component {
		handleChange = itemToSet => (event, { value }) =>
			new Promise(resolve =>
				this.setState(prevState => {
					console.log('Previous state:', prevState, '\nForm value set:', {
						[itemToSet]: value
					})
					return { [itemToSet]: value }
				}, resolve)
			)

		//generate the inputs object to create the markup
		makeDefaultInfo = inputNames => {
			return inputNames.reduce((inputsObj, inputKey) => {
				const humanField = camelToHuman(inputKey)
				const infoToAdd = {
					label: humanField,
					placeholder: humanField,
					id: inputKey,
					type: 'text',
					onChange: this.handleChange(inputKey)
				}
				return { ...inputsObj, [inputKey]: infoToAdd }
			}, {})
		}

		//TODO modify to use redux states
		getInfo = info => {

			return { 'name': 'Name: Bob', 'profession': 'About: Record label manager' }
		}

		generateInfoFields = metadata => {
			const obj = { 'name': 'bob', 'profession': 'software developer' }
			const inputsObj = this.getInfo(metadata)
			return Object.keys(inputsObj).map(currentInputKey =>
				<Segment>
					{inputsObj ? inputsObj[currentInputKey] : ''}
				</Segment>
			)
		}

		render() {
			return (
				<WrappedComponent
					{...this.props}
					data={this.state}
					generatedForm={this.generateInfoFields(infoFields)}
					handleChange={this.handleChange}
				/>
			)
		}
	}
}

export default withDefaultInfo
