import React from 'react';
import PropTypes from 'prop-types';

// Pure view component for a topbar. handleChange function determines which view is displayed
const CreateEventSteps = (props) => {
    return(
        <div className="ui one column row">
        <div className="ui column">
        <div className="ui fluid stackable steps">
            <a className={props.view=='CREATE_EVENT' ? 'active step' : 'step'} onClick={ () => props.handleChangeView('CREATE_EVENT') }>
                <i className="info circle icon"></i>
                <div className="content">
                    <div className="title">Create Event</div>
                </div>
            </a>
            <a className={props.view=='ADD_TICKET' ? 'active step' : 'step'} onClick={ () => props.handleChangeView('ADD_TICKET') }>
                <i className="ticket icon"></i>
                <div className="content">
                    <div className="title">Create Tickets</div>
                </div>
            </a>
            <a className={props.view=='PUBLISH_EVENT' ? 'active step' : 'step'} onClick={ () => props.handleChangeView('PUBLISH_EVENT') }>
                <i className="shipping icon"></i>
                <div className="content">
                    <div className="title">Publish Event</div>
                </div>
            </a>
        </div> 
        </div>
        </div>
    )
}
CreateEventSteps.propTypes = {
    view: PropTypes.string,
    handleChangeView: PropTypes.func,


}
export default CreateEventSteps