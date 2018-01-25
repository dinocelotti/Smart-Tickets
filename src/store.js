import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'
import reducers from './reducers'
import { getAccountsSuccess as actionCreators } from './actions/account-actions'
/**
 * Store.js uses the redux-thunk middleware to compose action-creators. Redux-thunk: https://github.com/gaearon/redux-thunk
 * More Reading: https://stackoverflow.com/questions/35411423/how-to-dispatch-a-redux-action-with-a-timeout/35415559#35415559
 * 
 * Thunk abstracts async action creators so they return functions instead, which is occasionally useful.
 */
const composeEnhancers = composeWithDevTools({ 
    actionCreators 
});
const store = createStore(reducers, composeEnhancers(
    applyMiddleware(thunk)
));

export default store
