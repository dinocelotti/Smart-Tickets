import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

const filters = [
    {name: 'All Events', filter: 'ALL_EVENTS'},
    {name: 'My Events', filter: 'PROMOTER_EVENTS'},
    {name: 'Distribution', filter: 'DISTRIBUTOR_EVENTS'},
];
export class EventListContainer extends React.Component {
    constructor(props){
        super(props);        
        this.state = {
            projects: {},
            userAccount: '',
            filter: 'ALL_EVENTS',
        }
        this.handleChangeFilter = this.handleChangeFilter.bind(this);
        this.filterProjects = this.filterProjects.bind(this);
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
    filterProjects(projects, filter){
        return Object.keys(projects).filter((address) => {
            // TODO: abstract these events into an object
            if(filter=='PROMOTER_EVENTS'){
                return projects[address].promoter == this.state.userAccount
            }
            else if(filter=='DISTRIBUTOR_EVENTS'){
                // This filter will return if any distributor address matches the user's address
                return projects[address].distributors.some((distributor) => {
                    return distributor == this.state.userAccount
                });
            }
            return address
        }).map((address) => {
            return projects[address]
        });
    }
    handleChangeFilter(nextFilter){
        if(this.state.filter != nextFilter){
            this.setState({
                filter: nextFilter
            });
        }
    }
    render() {
        return (
            <div>
                <FilterBar onClick={this.handleChangeFilter} filters={filters} activeFilter={this.state.filter}/>
                <div className="ui divide link items">
                    <EventList projects={this.filterProjects(this.state.projects, this.state.filter)}/>
                </div>
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
const FilterBar = (props) => {
    // Defines the filters that 
    const filterLinks = props.filters.map((filter) => {
        return (
            <a onClick={() => props.onClick(filter.filter)} className={props.activeFilter == filter.filter ? 'item active' : 'item'} key={filter.filter}>
                {filter.name}
            </a>
        )
    });
    return (
        <div className="ui blue pointing sticky menu" style={{borderRadius: 0}}>
           {filterLinks}
            <div className="right menu">
                <div className="ui fluid category search item">
                    <div className="ui icon input">
                        <input className="prompt" placeholder="Search events..." type="text"/>
                        <i className="search link icon"></i>
                    </div>
                    <div className="results"></div>
                </div>
            </div>
        </div>

    )
}
FilterBar.propTypes = {
    onClick: PropTypes.func.isRequired,
    activeFilter: PropTypes.string,
    filters: PropTypes.array,
}
const EventList = (props) => {
    return Object.keys(props.projects).map((address) => {
        return <Event {...props.projects[address]} key={address}/>
    });
}
EventList.propTypes = {
    projects: PropTypes.arrayOf(PropTypes.shape({
        address: PropTypes.string,
    }))
}
const Event = (props) => {
    return(
        <Link className="ui item" to={`/events/${props.address}`}>
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
        </Link>
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