import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';
import LogoutContainer from '../Account/LogoutContainer';

/**
 * Sidebar - app NavBar contains navigation links, stateless
 */
const SideNav = () => (
    <div>
        <Menu vertical fixed='left' inverted>
            <div className="ui logo icon image">
                <h1 className="ui header inverted">treblekey</h1>
            </div>
            <NavLink to={'/events'} className="item" activeClassName="active"><i className="icon tasks"/>View Events</NavLink>
            <NavLink to={'/createEvent'} className="item" activeClassName="active"><i className="icon edit"/>Create Event</NavLink>
            <NavLink to={'/account'} className="item" activeClassName="active"><i className="icon settings"/>Manage My Account</NavLink>
            <LogoutContainer />
        </Menu>
    </div>
)

export { SideNav }
