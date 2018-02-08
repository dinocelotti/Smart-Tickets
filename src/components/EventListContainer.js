import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

export class EventListContainer extends React.Component {
    constructor(props){
        super(props);        
        this.state = {
            projects: {},
            userAccount: '',
        }
    }
    componentDidMount(){
        this.updateState(this.props)
    }
    componentWillReceiveProps(nextProps){
        // loading is the inverse of deployed
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
        return (
            <div className="ui divide link items">
                <EventList projects={this.state.projects}/>
            </div>
        )
    }
}
// TODO: Fill in these PropTypes with final shapes
EventListContainer.propTypes = {
    projects: PropTypes.shape({

    }),
    userAccount: PropTypes.string
}
const EventList = (props) => {
    return Object.keys(props.projects).map((address) => {
        return <Event {...props.projects[address]} key={address}/>
    });
}
const Event = (props) => {
    return(
        <a className="item" href="#">
            <div className="ui small image statistic">
                <div className="value">00</div>
                <div className="label">MONTH</div>
            </div>
            <div className="content">
                <span className="header">{props.projectName}</span>
                <div className="description">
                    <span>0:00 AM</span>
                    <span> | </span>
                    <span>Location, Locale</span>
                </div>
                <div className="meta">
                    <span>{props.address}</span>
                </div>

                <div className="extra">
                    <div className="ui red basic label">Event</div>
                </div>
            </div> 
        </a>
    )
}
/**
 * redux bindings
 */
const mapStateToProps = ( state ) => {
    console.log('mapStateToProps')
	return {
		projects: state.projectState,
        userAccount: state.userState
	}
}
const mergeProps = (stateProps, dispatchProps, ownProps) => {
    console.log('mergeProps')
    return {
        ...ownProps,
        ...stateProps,
        ...dispatchProps,
    }
}
export default connect(mapStateToProps, null, mergeProps)(EventListContainer)