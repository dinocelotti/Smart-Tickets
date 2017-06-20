import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import TopNav from './top-nav'
import css from '../css/nav.css'
import fonts from '../css/fonts.css'
import logo from '../images/logo-white.svg'

export class SideNav extends React.Component {
	constructor() {
		super()
		this.state = {
			routes: [
				{
					path: '/',
					exact: true,
					component: () => <h1>Home</h1>,
				},
				{
					path: '/events',
					component: () => <h1>Events</h1>,
				},
			],
		}
	}
	render() {
		return (
			<Router>
				<div>
					<div className={css.sidenav}>
						<img src={logo} className={css.sidenav__logo} />
						<ul>
							<li className={css.sidenav__link_li}>
								<Link className={css.sidenav__link} to="/">
									<i className={[fonts.materialIcons, fonts.mdLight].join(' ')}>
										home
									</i>
									<span>Home</span>
								</Link>
							</li>
							<li className={css.sidenav__link_li}>
								<Link className={css.sidenav__link} to="/events">
									<i className={[fonts.materialIcons, fonts.mdLight].join(' ')}>
										event
									</i>
									<span>Events</span>
								</Link>
							</li>
						</ul>
					</div>

					<div className={css.content}>
						<TopNav />
						{this.state.routes.map((route, index) =>
							<Route
								key={index}
								path={route.path}
								exact={route.exact}
								component={route.component}
							/>
						)}
					</div>
				</div>
			</Router>
		)
	}
}

export default SideNav
