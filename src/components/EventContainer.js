import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class EventContainer extends React.Component{
    constructor(props){
        super(props);
        const projectAddress = props.match.params.address;
        this.state={
            loading: true,
            projects: {},
            projectAddress: projectAddress,
        }
    }
    componentDidMount(){
        this.updateState(this.props)
    }
    componentWillReceiveProps(nextProps){
        if(nextProps != this.props){
            this.updateState(nextProps)
        }
    }
    updateState(thatProps){
        this.setState({
            projects: thatProps.projects,
            userAccount: thatProps.userAccount
        });
    }
    render() {
        if(this.state.projects[this.state.projectAddress]){
            return <EventView project={this.state.projects[this.state.projectAddress]}/>
        }
        return (
            <p>We're having a hard time finding that event... are you sure you got the address right?</p>
        )
    }
}
EventContainer.propTypes = {
    projects: PropTypes.object,
    userAccount: PropTypes.string,
}
const EventView = (props) => {
    return (
        <div>
            <div className="ui padded internally stackable grid">
                <div className="ui two column middle aligned row">
                    <div className="ui column" style={{maxWidth: 100}}>
                        <div className="ui statistic">
                            <div className="ui value">00</div>
                            <div className="label">Month 0000</div>
                        </div>
                    </div>
                    <div className="ui column">
                        <div className="ui huge header">{props.project.projectName}
                            <div className="sub header">{props.project.address}</div>
                        </div>
                        <div className="description">
                            <span>0:00 AM</span>
                            <span> | </span>
                            <span>Location, Locale</span>
                        </div>
                    </div>
                </div>
                <div className="ui two column row">
                    <div className="ui column ten wide">
                        <div className="ui header">Description</div>
                        <p>The description data structure isn't implemented yet!</p>
                        <p>Use your imagination ...</p>
                    </div>
                    <div className="ui column six wide">
                        <PromoterCard address={props.project.promoter}/>
                    </div>   
                </div>
            </div>
            <TicketList tickets={props.project.tickets}/>
        </div>
    )
}
EventView.propTypes = {
    project: PropTypes.object.isRequired,
    userAccount: PropTypes.string,
}
const PromoterCard = (props) => {
    return (
        <div className="ui card" style={{width: '100%'}}>
            <div className="ui content">
                <img src="" alt=""/>
                <div>Event Promoter</div>
                <div className="header">promotername</div>

                <div className="meta" style={{wordWrap: 'break-word'}}> {props.address} </div>
            </div>
            <div className="extra content">
                Rating:
                <div className="ui rating">--%</div>
            </div>
        </div>
    )
}
PromoterCard.propTypes = {
    address: PropTypes.string
}
const TicketList = (props) => {
    const tickets = Object.keys(props.tickets).map((address)=>{
        const ticket = props.tickets[address]
        return(
            <div className="ui four column center aligned row">
                <div className="ui left aligned column">
                    <div className="ui header">
                        {ticket.ticketType}
                        <div className="ui sub header" style={{wordWrap: 'break-word'}}>{ticket.id}</div>
                    </div>
                </div>
                <div className="ui column">
                    <div className="ui small statistic">
                        <div className="value">{ticket.quantity}</div>
                        <div className="label">Remaining</div>
                    </div>
                </div>
                <div className="ui column">
                    <div className="ui small green statistic">
                        <div className="value">{ticket.faceValue}</div>
                        <div className="label">CAD</div>
                    </div>
                </div>
                <div className="ui column">
                    <a className="ui large button primary" href="./ConsumerPurchaseTickets.html">Buy Now</a>
                    <div>Membran Canada</div>
                </div>
            </div>
        )
    });
    return (
        <div>
            <div className="ui horizontal divider header">Official Tickets</div>
            <div className="ui padded internally stackable stackable grid">
                {tickets}
            </div>
        </div>
    )
}
TicketList.propTypes = {
    tickets: PropTypes.object
}
/**
 * redux bindings
 */
const mapStateToProps = ( state ) => {
	return {
		projects: state.projectState,
        userAccount: state.userState
	}
}
const mergeProps = (stateProps, dispatchProps, ownProps) => {
    return {
        ...ownProps,
        ...stateProps,
        ...dispatchProps,
    }
}
export default connect(mapStateToProps, null, mergeProps)(EventContainer)