import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'

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

const NavLink = props => {
	return (
		<StyledLink {...props}>
			{props.children}
		</StyledLink>
	)
}

export default NavLink
