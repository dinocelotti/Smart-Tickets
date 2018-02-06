import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react'

/**
 * Creates a top bar that displays the steps to creating an event
 *  
 */
const PublishEvent = (props) => {
    return(
        <div className="ui container">
            <Button onClick={props.handleSubmit}> 
                Create Event
            </Button>
        </div>
    )
}
PublishEvent.propTypes = {

}
export default PublishEvent