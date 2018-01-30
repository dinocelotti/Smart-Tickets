import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { getAccounts } from './actions/account-actions';
import ethApi from './api/eth-api';
import store from './store';
/* Import WebWorker that watches the blockchain. Uses the worker-loader package for webpack to register loadAppState as a workernp */
//eslint dislikes the require syntax
//eslint-disable-next-line
const Worker = require('worker-loader?inline&fallback=false!./api/loadAppState.js');
/**
 * Import Components
 */
import { Wrapper } from './components/Wrapper'
import { EventListContainer } from './components/EventListContainer'
import { LoadingSplash } from './components/Status/Loaders';
/**
 * Import Custom CSS
 */
import './styles/reset.css';
import './styles/fonts.css';
import './styles/global.css';
/**
 * Wrapper component for the whole app. Spawns a Webworker to load the projectResolver
 * 
 * @param {projectResolver} projectResolver - refers to the project resolver contract, ProsjectResolver.sol
 */
class AppContainer extends React.Component { 
    constructor(props){
        super(props);
        this.state={loading:true};
    }
    componentDidMount() {
        this.load();
    }
    componentWillReceiveProps(nextProps){
        if(nextProps.projectResolver.deployed){
            this.setState({
                loading:false
            });
        }
    }
    async load() {
        //TODO: duplicate loading here... due to the WW not sharing the same functions/objects as the bundle
        await ethApi.loadContracts();
        await ethApi.deployContract({
            _contract: ethApi.projectResolver,
            name: 'projectResolver'
        });
        this.props.getAccounts();
        /**
         * This worker watches for events on the blockchain, and then 
         * dispatches actions to the store based upon those events
         */
        const worker = new Worker();
        worker.onmessage = e => {
            console.log("Webworker Dispatch: " + e.data);
            store.dispatch(e.data);
        };
    }    
    render() {
        if (this.state.loading) {
            return (
                <div>
                    <LoadingSplash message="Connecting to the Blockchain"/>
                </div>
            )
        }
        return(
            <div>
                <Router>
                    <Wrapper>
                        <Switch>
                            <Route path="/events" component={EventListContainer}/>
                            <Route path="/createEvent" component={EventListContainer}/>
                            <Route path="/account" component={EventListContainer}/>
                        </Switch>
                    </Wrapper>
                </Router>
            </div>
        )
    }
}
AppContainer.propTypes = {
    projectResolver: PropTypes.shape({ deployed: PropTypes.bool })
};
/**
 * Redux bindings 
 */
function mapStateToProps({ web3State: { projectResolver } }) {
    return { 
        projectResolver
    };
}
const mapDispatchToProps = dispatch => ({
    getAccounts: () => dispatch(getAccounts())
});  
export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);


