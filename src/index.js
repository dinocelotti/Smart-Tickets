import Root from './Root'
import React from 'react'
import ReactDOM from 'react-dom'
import store from './store'
/**
 * This is Webpack's primary access point.
 * Top-level ReactDom rendering node. Also defines the ReduxStore and passes it to the Root.
 * 
 * Keep this file plain JS
 */
ReactDOM.render(
	<Root store={store} />,
	document.getElementById('root')
)
