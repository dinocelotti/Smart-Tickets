import React from 'react'
import PropTypes from 'prop-types'
import { Loader, Modal } from 'semantic-ui-react';
/**
 * LoadingSplash - fullscreen loading splash (used for initial app load)
 * @param {string} message - optional string is rendered beneath the loader 
 */
const LoadingSplash = ({message}) => (
    <Modal open basic>
        <Modal.Content>
            <Loader size='huge'>{message}</Loader>
        </Modal.Content>
    </Modal>
)
LoadingSplash.propTypes = {
    message: PropTypes.string
};
export { LoadingSplash }