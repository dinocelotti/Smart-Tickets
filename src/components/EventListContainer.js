import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

export class EventListContainer extends React.Component {
    constructor(props){
        super(props);
        this.state={};
    }
    componentDidMount(){

    }
    render() {
        return (
            <p>elc</p>
        )
    }
}
EventListContainer.propTypes = {
    projectState: PropTypes.shape({ deployed: PropTypes.bool })
};

export default connect(
	({
		projectState,
		accountState: accounts,
		ticketState,
		distributorState
	}) => ({
			projectState,
			accounts,
			ticketState,
			distributorState
		})
)(EventListContainer)
