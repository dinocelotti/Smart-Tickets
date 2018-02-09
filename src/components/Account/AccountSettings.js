import React from 'react'
import PropTypes from 'prop-types'
/**
 * This is a placeholder for future user settings
 * @param {string} userAccount 
 */
const AccountSettings = (props) => {
    return(
        <div className="ui internally padded stackable grid"> 
        <div className="ui one column row">
        <div className="ui column">
        <div className="ui segment">
            <h3 className="ui header">YOUR ACCOUNT</h3>
            <p>Your address is {props.userAccount}</p>
        </div>
        </div>
        </div>
        </div>
    )
}
AccountSettings.propTypes = {
    userAccount: PropTypes.string
}
export default AccountSettings