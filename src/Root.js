import React from 'react'
import PropTypes from 'prop-types'
import { Provider } from 'react-redux'
import AppContainer from './AppContainer'
import { BrowserRouter as Router, Route } from 'react-router-dom'
/**
 * Root - wraps the App with a Provider component
 * The Provider component adds the store to the application context, so it can be accessed by any child component.
 * 
 * @param {store} store - The redux store for the application. 
 */
const Root = ({ store }) => (
    <Provider store={store}>
        <Router>
            <div>
                <Route path='/' component={AppContainer}/>
            </div>
        </Router>
    </Provider>
)

Root.propTypes = {
    store: PropTypes.object.isRequired
}
  
export default Root