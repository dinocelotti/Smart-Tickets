import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import projectApi from '../../api/project-api'

import PublishEvent from './PublishEvent'
import CreateEvent from './CreateEvent'
import CreateTicketController from './CreateTicketController'
import CreateEventSteps from './CreateEventSteps'

/**
 * The primary event creation container
 * is responsible for transacting with redux, handling calls to the API
 */
class CreateEventContainer extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            view: 'CREATE_EVENT', // determines which view we're looking at: CREATE_EVENT, CREATE_TICKET, PUBLISH_EVENT
            projectName: '', 
            userAccount: '',
            consumerMaxTickets: 4,
            tickets: [] // tickets handled by CreateTicketController, this component is source of truth
        };

        // Bound functions
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeView = this.handleChangeView.bind(this);        
        this.handleChangeTickets = this.handleChangeTickets.bind(this);                
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
    // Checks if the ticket state has changed and updates the state if it has
    handleChangeTickets(nextTickets) {
        if(this.state.tickets != nextTickets){
            this.setState({
                tickets: nextTickets
            });
        }
    }
    // Passed into the steps component, sets view state
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
        this.setState({
            loading: true
        });
        this.createEvent()
        this.setState({
            loading: false
        });
    }
    // Creates event on the blockchain
    // TODO: Implement error handling in this component
    createEvent = async () => {
        const promoterAddress = this.state.userAccount
        console.log(this.state.userAccount)
        // CREATE EVENT
        const projectData = {
            projectName: this.state.projectName,
            promoterAddress: this.state.userAccount
        }        
        const projectAddress = await projectApi.createProject( projectData )   
        alert("the address of the project is:" + projectAddress)
        const promoterInstance = await new projectApi.Promoter(promoterAddress, projectAddress)
        await promoterInstance.init()
        // CREATE TICKETS
        await this.state.tickets.forEach((ticket)=>{
            promoterInstance.addTicket(ticket.ticketClass, ticket.faceValue, ticket.maxPrice, ticket.totalNumber)
        });
    
    }
    // Render the view component and steps component
    renderComponent(ViewComponent){
        return(
            <div className="ui padded grid">
                <CreateEventSteps view={this.state.view} handleChangeView={this.handleChangeView}/>
                {ViewComponent}
            </div>
        )
    }
    // Choose which view to render
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
                <CreateTicketController
                    tickets={this.state.tickets}
                    handleChange={this.handleChangeTickets}
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
    }),
    userAccount: PropTypes.string,
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
// not dispatching anything
export default connect(mapStateToProps, null, mergeProps)(CreateEventContainer)