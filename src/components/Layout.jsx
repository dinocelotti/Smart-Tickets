import React from 'react'
import styled from 'styled-components'
import Nav from './Nav'

const Layout = props => {
	const View = styled.div`
		display: inline-block;
		vertical-align: top;
		position: absolute;
		width: calc(100% - 224px);
		height: 100%;
		overflow: auto;
	`
	const TopNav = styled.div`
		border-bottom: 1px solid #d8d8d8;
		position: sticky;
		top: 0;
		background-color: #fff;
		z-index: 1;
		& > h5 {
			font-size: 24px;
			padding: 24px;
		}
	`
	return (
		<div>
			<Nav />
			<View>
				<TopNav>
					<h5>Heading</h5>
				</TopNav>
				{props.children}
			</View>
		</div>
	)
}

export default Layout
