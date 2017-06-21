import { createStore, applyMiddleware } from 'redux'
import reducers from './reducers'
import { devToolsEnhancer } from 'redux-devtools-extension'
const logger = store => next => action => {
	console.log('dispatching', action)
	let result = next(action)
	console.log('next state', store.getState())
	return result
}

const store = createStore(reducers, devToolsEnhancer())
export default store
