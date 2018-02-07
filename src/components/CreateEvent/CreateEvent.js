import React from 'react';
import PropTypes from 'prop-types';

// Pure view component for event creation
const CreateEvent = (props) => {
    return(
        <div className="ui row">
        <div className="ui column">
            <form className="ui large green segment form">
                <div className="field">
                    <label>Event Name</label>
                    <input 
                        onChange={props.handleChange}
                        value={props.projectName} 
                        name="projectName" 
                        placeholder="Event Name" 
                        type="text"
                    />
                </div>
                <div className="field">
                    <label>Maximum Tickets Per Consumer</label>
                    <input 
                        onChange={props.handleChange}                
                        value={props.consumerMaxTickets} 
                        name="consumerMaxTickets" 
                        placeholder="Max Per Person" 
                        type="text"
                    />
                </div>
            </form>
        </div>
        </div>
    )
}
CreateEvent.propTypes = {
    projectName: PropTypes.string,
    consumerMaxTickets: PropTypes.number,
}
export default CreateEvent