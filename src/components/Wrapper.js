import React from 'react'
import PropTypes from 'prop-types'
import { SideNav }from './Navigation/SideNav'

var sideNavStyle = {
    
};
var wrapperStyle = {
    paddingLeft: 240
}
/**
 * Wrapper - Divides screen into sidebar and renders children into remaining space
 */
const Wrapper = (props) => (
    <div>
        <SideNav style={sideNavStyle}/>
        <div style={wrapperStyle}>
            {props.children}
        </div>

    </div>
)

export { Wrapper }