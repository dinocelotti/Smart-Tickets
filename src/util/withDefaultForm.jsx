import React, { Component } from 'react'
import { Form, Input } from 'semantic-ui-react'
import camelToHuman from './stringUtils'
function withDefaultForm(WrappedComponent, formFields) {
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
		makeDefaultInputs = inputNames => {
			return inputNames.reduce((inputsObj, inputKey) => {
				const humanField = camelToHuman(inputKey)
				const inputToAdd = {
					label: humanField,
					placeholder: humanField,
					id: inputKey,
					type: 'text',
					onChange: this.handleChange(inputKey)
				}
				return { ...inputsObj, [inputKey]: inputToAdd }
			}, {})
		}

		generateInputs = inputsObj => {
			const inputNames = Object.keys(inputsObj)
			return inputNames.reduce((defaultInputs, currentInputKey) => {
				const currentInput = inputsObj[currentInputKey]

				const customAttributeKeys = Object.keys(currentInput) //go down a sublevel and get the keys

				const currentCustomAttributes = customAttributeKeys.reduce(
					(customInputObject, currentAttribute) => ({
						...customInputObject,
						[currentAttribute]: currentInput[currentAttribute]
					}),
					{}
				)

				const currentDefaultAttributes = defaultInputs[currentInputKey]

				const currentInputToAdd = {
					...currentDefaultAttributes,
					...currentCustomAttributes
				}

				return {
					...defaultInputs,
					[currentInputKey]: currentInputToAdd
				}
			}, this.makeDefaultInputs(inputNames))
		}

		generateInputFormFields = metadata => {
			const inputsObj = this.generateInputs(metadata)
			return Object.keys(inputsObj).map(currentInputKey =>
				<Form.Field key={currentInputKey}>
					<Input {...inputsObj[currentInputKey]} />
				</Form.Field>
			)
		}
		render() {
			return (
				<WrappedComponent
					{...this.props}
					data={this.state}
					generatedForm={this.generateInputFormFields(formFields)}
					handleChange={this.handleChange}
				/>
			)
		}
	}
}

export default withDefaultForm
