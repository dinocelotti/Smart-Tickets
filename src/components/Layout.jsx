import React, { Component } from 'react'
import styled from 'styled-components'
import Nav from './Nav'
import propTypes from 'prop-types'

class Layout extends Component {
	static propTypes = {
		children: propTypes.any
	}
	View = styled.div`
		display: inline-block;
		vertical-align: top;
		position: absolute;
		width: calc(100% - 224px);
		height: 100%;
		overflow: auto;
	`
	TopNav = styled.div`
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
	render() {
		return (
			<div>
				<Nav />
				<this.View>
					<this.TopNav>
						<h5>Heading</h5>
					</this.TopNav>
					{this.props.children}
				</this.View>
			</div>
		)
	}
}

export default Layout
