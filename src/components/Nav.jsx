import React from 'react'
import styled from 'styled-components'
import NavLink from './NavLink'
import logo from '../images/logo-white.svg'
import MaterialIcon from '../styles/materialIcon'

const Nav = () => {
	const Navbar = styled.div`
		height: 100vh;
		background-color: #000;
		display: inline-block;
		width: 224px;
		position: sticky;
		top: 0;
	`
	const Logo = styled.img`
		width: 112px;
		margin: 12px 0px;
		margin-left: calc(50% - 56px);
	`

	return (
		<Navbar>
			<Logo src={logo} alt="" />
			<NavLink to="/">
				<MaterialIcon>home</MaterialIcon> <span>Home</span>
			</NavLink>
			<NavLink to="/events">
				<MaterialIcon>event</MaterialIcon> <span>Events</span>
			</NavLink>
			<NavLink to="/components">
				<MaterialIcon>code</MaterialIcon> <span>Components</span>
			</NavLink>
		</Navbar>
	)
}

export default Nav
