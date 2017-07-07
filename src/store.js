import { createStore, applyMiddleware } from 'redux'
import reducers from './reducers'
import { devToolsEnhancer } from 'redux-devtools-extension'

const store = createStore(reducers, devToolsEnhancer())
export default store
