import React from 'react'
import css from '../css/nav.css'

export default class TopNav extends React.Component {
	render() {
		return (
			<div className={css.topnav}>
				{/* TODO: make <h5 /> text change based on route, ( breadcrumbs ) */}
				<h5 className={css.topnav__h5}>Top Nav</h5>
				{/* TODO: make a proper account component */}
			</div>
		)
	}
}
