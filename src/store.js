import { createStore, applyMiddleware } from 'redux'
import reducers from './reducers'
import { composeWithDevTools } from 'redux-devtools-extension'
import thunk from 'redux-thunk'
import { getAcctsSuccess as actionCreators } from './actions/acct-actions'
const composeEnhancers = composeWithDevTools({ actionCreators })
const store = createStore(reducers, composeEnhancers(applyMiddleware(thunk)))
export default store
