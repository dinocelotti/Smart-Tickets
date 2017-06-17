import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import css from '../css/side-nav.css'
import { EthTable } from '../containers/acct-tables-cont'

export class Sidenav extends React.Component {
	constructor() {
		super()
		this.state = {
			routes: [
				{
					path: '/',
					exact: true,
					view: () => <h1>Home</h1>,
				},
				{
					path: '/bubblegum',
					view: () => <h2>Bubblegum</h2>,
				},
				{
					path: '/shoelaces',
					view: () => <EthTable />,
				},
			],
		}
	}
	render() {
		return (
			<Router>
				<div>
					<div className={css.sidenav}>
						<ul>
							<li><Link className={css.route} to="/">Home</Link></li>
							<li>
								<Link className={css.route} to="/bubblegum">Bubblegum</Link>
							</li>
							<li>
								<Link className={css.route} to="/shoelaces">Shoelaces</Link>
							</li>
						</ul>
					</div>

					<div className={css.content}>
						{this.state.routes.map((route, index) =>
							<Route
								key={index}
								path={route.path}
								exact={route.exact}
								component={route.view}
							/>
						)}
					</div>
				</div>
			</Router>
		)
	}
}

export default Sidenav
