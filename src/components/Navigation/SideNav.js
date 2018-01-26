import React from 'react'
import PropTypes from 'prop-types'
import { Menu } from 'semantic-ui-react';
import logo from '../../images/logo-white.svg'

const logoStyle = {
    width: 112,
    margin: "12 0px",
    marginLeft: "calc(50% - 56px)"
}

/**
 * Sidebar - app NavBar contains navigation links, stateless
 */
const SideNav = () => (
    <div>
        <Menu vertical fixed='left' inverted>
            <img src={logo} style={logoStyle}/>
            <Menu.Item name='menu item'/>
            <Menu.Item name='menu item'/>
            <Menu.Item name='menu item'/>
        </Menu>
    </div>
)

export { SideNav }

/*
<div class="ui vertical fixed menu bound left inverted" style="height:100vh;border-radius:0px; width:220px">
<div class="item">
    <a class="ui logo icon image" href="/"><img src="membran-logo-white.png" class="image"></a>
</div>
<a class="item active" href="./ConsumerViewEvents.html">
    <i class="icon tasks"></i>
    View Events
</a>
<a class="item" href="./CreateEvent.html">
    <i class="icon edit"></i>
    Create an Event</a>

<a class="item" href="./ConsumerViewEvents.html">
    <i class="icon settings"></i>
    Manage My Account</a>
<a class="item" href="./ConsumerManageTickets">
    <i class="icon red log out"></i>
    Logout</a>
</div>

*/