/* eslint-env jest */

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import store from './store'
import { Provider } from 'react-redux'
const div = document.createElement('div')
it('renders without crashing', () => {
	ReactDOM.render(
		<Provider store={store}>
			<App />
		</Provider>,
		div
	)
})
