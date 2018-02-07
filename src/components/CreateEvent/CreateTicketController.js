import React from 'react';
import PropTypes from 'prop-types';
import { Button, Divider } from 'semantic-ui-react'

/**
 * Controller for the tickets - stateless but has business logic
 * calls back to CreateEventContainer with all of it's data.
 */
class CreateTicketController extends React.Component{
    constructor(props){
        super(props);
        this.onChange = this.onChange.bind(this);
        this.addTicket = this.addTicket.bind(this);
        this.deleteTicket = this.deleteTicket.bind(this);
        // No state & componentWillReceiveProps is required because the parent state update will trigger a re-render
    }
    onChange(index, event) {
        const tickets = this.props.tickets.slice() // copy the tickets
        const name = event.target.name // get the name of the input
        const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value; // support for fields and bools
 
        tickets[index][name] = value; // set the value of the given ticket's value
        // update the state
        this.props.handleChange(tickets);// send up the state
    }
    addTicket(){
        const tickets = this.props.tickets.slice() // copy the tickets
        tickets.splice(tickets.length, 0, { // insert new ticket at the end of the list
            ticketClass: '',
            totalNumber: '',
            maxPrice: '',
            faceValue: '',
        });
        this.props.handleChange(tickets);// send up the state
    }
    deleteTicket(index){
        const tickets = this.props.tickets.slice()
        tickets.splice(index, 1);
        this.props.handleChange(tickets);// send up the state
    }
    render(){
        const listTickets= this.props.tickets.map((ticket, index) =>
            <Ticket {...ticket} onChange={this.onChange} deleteTicket={this.deleteTicket} index={index} key={index}/> // spread ticket into <Ticket /> props
        );
        return(  
            <div className="ui row">
            <div className="ui column">
                {listTickets}
                <AddTicket addTicket={this.addTicket}/>
            </div>
            </div>
        )
    }
}
CreateTicketController.propTypes = {
    tickets: PropTypes.arrayOf(PropTypes.shape({
        ticketClass: PropTypes.string.isRequired,
        totalNumber: PropTypes.string,
        maxPrice: PropTypes.string,
        faceValue: PropTypes.string,
    })),
    handleChange: PropTypes.func,
}
// View component that calls the addticket callback
// Could be a generic button component
const AddTicket = (props) => {
    return (
        <div className="ui row">
            <div className="ui column">
                <Divider horizontal>
                    <Button color="green" onClick = {props.addTicket}>Add a Ticket</Button>
                </Divider>
            </div>
        </div>
    )
}
AddTicket.propTypes = {
    addTicket: PropTypes.func,
}
// View component that renders the ticket form
// All the values are controlled by the above controller
const Ticket = (props) => {
    return(
        <div className="ui row">
        <div className="ui column">
        <form className="ui large green form segment">
            <div className="fields">
                <div className="field ten wide">
                    <label>Ticket Class</label>
                    <input 
                        onChange={(e) => props.onChange(props.index, e)}
                        value={props.ticketClass}
                        name="ticketClass"
                        placeholder="Class Name"
                        type="text"
                    />
                </div>
                <div className="field six wide">
                    <label>Total Number</label>
                    <input 
                        onChange={(e) => props.onChange(props.index, e)}
                        value={props.totalNumber}
                        name="totalNumber"
                        placeholder="Total"
                        type="text"
                    />
                </div>
            </div>
            <div className="fields">
                <div className="field three wide">
                    <label>Face Value</label>
                    <input 
                        onChange={(e) => props.onChange(props.index, e)}
                        value={props.faceValue}
                        name="faceValue"
                        placeholder="$"
                        type="text"
                    />
                </div>
                <div className="field three wide">
                    <label>Max Price</label>
                    <input 
                        onChange={(e) => props.onChange(props.index, e)}
                        value={props.maxPrice}
                        name="maxPrice"
                        placeholder="$"
                        type="text"
                    />
                </div>
                <div className="field ten wide">
                    <div onClick={() => props.deleteTicket(props.index)} className="ui button red basic right floated">Delete</div>
                </div>
            </div>
        </form>
        </div>
        </div>
    )
}
Ticket.propTypes = {
    ticketClass: PropTypes.string,
    totalNumber: PropTypes.string,
    maxPrice: PropTypes.string,
    faceValue: PropTypes.string,
    index: PropTypes.number,
    onChange: PropTypes.func,
    deleteTicket: PropTypes.func,
}
export default CreateTicketController