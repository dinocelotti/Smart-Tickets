import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import projectApi from '../../api/project-api'

import PublishEvent from './PublishEvent'
import CreateEvent from './CreateEvent'
import CreateTicket from './CreateTicket'
import CreateEventSteps from './CreateEventSteps'

class CreateEventContainer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            view: 'CREATE_EVENT', // determines which view we're looking at: CREATE_EVENT, CREATE_TICKET, PUBLISH_EVENT
            projectName: '', 
            userAccount: '',
            consumerMaxTickets: 4,
            tickets: []
        };

        // Bound functions
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeView = this.handleChangeView.bind(this);        
        this.handleSubmit = this.handleSubmit.bind(this);
        this.createEvent = this.createEvent.bind(this);
        this.renderComponent = this.renderComponent.bind(this);        
    }
    componentDidMount(){
        this.setState({
            userAccount: this.props.userAccount
        });
    }
    componentWillReceiveProps(nextProps){
        if(nextProps != this.props){
            this.setState({
                userAccount: nextProps.userAccount
            });
        }
    }
    // Handles changes in the events fields
    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
    }
    // Passed into the steps component, sets view
    handleChangeView(nextView) {
        if(this.state.view != nextView){
            this.setState({
                view: nextView
            });
        }
    }
    // Creates the event and pushes the tickets with it
    handleSubmit(event) {
        alert('We are creating '+this.state.projectName+' on the blockchain...');
        event.preventDefault();
        this.createEvent();
    }
    // Set to loading until the event is created. Catch errors. 
    createEvent = async () => {
        const projectData = {
            projectName: this.state.projectName,
            promoterAddress: this.state.userAccount
        }
        this.setState(() => ({ loading: true }));
        await projectApi.createProject( projectData )   
    }
    // Render the view component and steps component
    renderComponent(ViewComponent){
        return(
            <div>
                <CreateEventSteps view={this.state.view} handleChangeView={this.handleChangeView}/>
                {ViewComponent}
            </div>
        )
    }
    render() {
        let ViewComponent = '';
        if(this.state.view == 'CREATE_EVENT'){
            ViewComponent = (
                <CreateEvent
                    projectName={this.state.projectName}
                    consumerMaxTickets={this.state.consumerMaxTickets}
                    handleChange={this.handleChange}
                />
            )
        }
        else if(this.state.view == 'ADD_TICKET'){
            ViewComponent = (
                <CreateTicket 
                    projectName={this.state.projectName}
                    consumerMaxTickets={this.state.consumerMaxTickets}
                    handleChange={this.handleChange}
                />
            )
        }else{
            ViewComponent = (
                <PublishEvent
                    handleSubmit={this.handleSubmit}
                />
            )
        }
        return this.renderComponent(ViewComponent);
    }
}
// TODO add shape for various
CreateEventContainer.propTypes = {
    projectsByAddress: PropTypes.shape({
        state: PropTypes.string,
        tickets: PropTypes.array,
        distributors: PropTypes.array,
        ticketHolders: PropTypes.array,
        purchasesFromPromoter: PropTypes.array,
        purchasesFromDistributor: PropTypes.array,
        promoter: PropTypes.string,
        projectName: PropTypes.string,
        address: PropTypes.string,
    })
};
/**
 * redux bindings
 * 
 * getting all the projects (for form validation) and the current user's account
 */
const mapStateToProps = ( state ) => {
    console.log('mapStateToProps')
	return {
		projectsByAddress: state.projectState.byId,
		userAccount: state.userState
	}
}
const mergeProps = (stateProps, dispatchProps, ownProps) => {
    console.log('mergeProps')
    return {
        ...ownProps,
        ...stateProps,
        ...dispatchProps
    }
}
export default connect(mapStateToProps, null, mergeProps)(CreateEventContainer)