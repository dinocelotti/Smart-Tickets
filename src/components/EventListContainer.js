import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

export class EventListContainer extends React.Component {
    constructor(props){
        super(props);

        
    }
    componentDidMount(){
        console.log('EventListContainer.componentDidMount')
        this.updateState(this.props)
    }
    componentWillReceiveProps(nextProps){
        console.log('EventListContainer.componentWillReceiveProps')        
        // loading is the inverse of deployed
        if(nextProps != this.props){
            this.updateState(nextProps)
        }
    }
    updateState(thatProps){
        console.log('EventListContainer.updateState')        
        this.setState({
            projects: thatProps.projects,
            projectsByAddress: thatProps.projectsByAddress,
            userAccount: thatProps.userAccount
        });

    }
    render() {
        return (
            <div>
                {this.props.userAccount}
                <p> test </p>
            </div>
        )
    }
}
// TODO: Fill in these PropTypes with final shapes
EventListContainer.propTypes = {
    projects: PropTypes.arrayOf(PropTypes.object),
    projectsByAddress: PropTypes.array,
    userAccount: PropTypes.string
};
/**
 * redux bindings
 */
const mapStateToProps = ( state ) => {
    console.log('mapStateToProps')
	return {
		projects: state.projectState.ids,
		projectsByAddress: state.projectState.byId,
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