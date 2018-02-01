import React from 'react'
import PropTypes from 'prop-types'
import { SideNav }from './Navigation/SideNav'

/**
 * Padding left to clear the sidebar
 */
var wrapperStyle = {
    paddingLeft: 240
}
/**
 * Wrapper - Divides screen into sidebar and renders children into remaining space
 * 
 * @param {props} props - contains child elements to be rendered
 */
const Wrapper = (props) => (
    <div>
        <SideNav/>
        <div style={wrapperStyle}>
            {props.children}
        </div>
    </div>
)
Wrapper.propTypes = {
    children: PropTypes.element
}

export { Wrapper }