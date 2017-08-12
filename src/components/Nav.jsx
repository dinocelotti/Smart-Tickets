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
				<MaterialIcon>supervisor_account</MaterialIcon> <span>Promoter</span>
			</NavLink>
			<NavLink to="/distributor">
				<MaterialIcon>wifi_tethering</MaterialIcon> <span>Distributor</span>
			</NavLink>
			<NavLink to="/endconsumer">
				<MaterialIcon>face</MaterialIcon> <span>End Consumer</span>
			</NavLink>
		</Navbar>
	)
}

export default Nav
