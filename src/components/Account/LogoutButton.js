import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
/**
 * Logout Button - app NavBar contains navigation links, stateless
 */
const LogoutButton = (props) => (
    <NavLink className='item' to='#' color='red' onClick={props.onClick}>
        Logout
    </NavLink>
)
LogoutButton.propTypes = {
    onClick: PropTypes.func.isRequired
}
export { LogoutButton }
