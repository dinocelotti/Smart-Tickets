import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class CreateEventContainer extends React.Component {
    constructor(props){
        super(props);
        this.state={};
    }
    componentDidMount(){

    }
    render() {
        return (
            <p>CreateEventContainer</p>
        )
    }
}
CreateEventContainer.propTypes = {
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
)(CreateEventContainer)
