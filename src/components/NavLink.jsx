import React, { Component } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import propTypes from 'prop-types'
const StyledLink = styled(Link)`
	color: #fff;
	line-height: 24px;
	font-size: 14px;
	text-decoration: none;
	padding: 8px 0px;
	display: block;
	height: 24px;
	& > i, & > span {
		vertical-align: middle;
		padding-left: 16px;
	}
`

export default class NavLink extends Component {
	static propTypes = {
		children: propTypes.any
	}
	render() {
		return (
			<StyledLink {...this.props}>
				{this.props.children}
			</StyledLink>
		)
	}
}
