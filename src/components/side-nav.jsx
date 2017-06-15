import React from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import css from '../css/side-nav.css'

// Each logical "route" has two components, one for
// the sidebar and one for the main area. We want to
// render both of them in different places when the
// path matches the current URL.
const routes = [
	{
		path: '/',
		exact: true,
		sidebar: () => <div>home!</div>,
		main: () => <h2 className={css.fullpage}>Home</h2>,
	},
	{
		path: '/bubblegum',
		sidebar: () => <div>bubblegum!</div>,
		main: () => <h2>Bubblegum</h2>,
	},
	{
		path: '/shoelaces',
		sidebar: () => <div>shoelaces!</div>,
		main: () => <h2>Shoelaces</h2>,
	},
]

const Sidenav = () =>
	<Router>
		<div>
			<div className={css.sidenav}>
				<ul>
					<li><Link to="/">Home</Link></li>
					<li><Link to="/bubblegum">Bubblegum</Link></li>
					<li><Link to="/shoelaces">Shoelaces</Link></li>
				</ul>

				{routes.map((route, index) =>
					// You can render a <Route> in as many places
					// as you want in your app. It will render along
					// with any other <Route>s that also match the URL.
					// So, a sidebar or breadcrumbs or anything else
					// that requires you to render multiple things
					// in multiple places at the same URL is nothing
					// more than multiple <Route>s.
					<Route
						key={index}
						path={route.path}
						exact={route.exact}
						component={route.sidebar}
					/>
				)}
			</div>

			<div>
				{routes.map((route, index) =>
					// Render more <Route>s with the same paths as
					// above, but different components this time.
					<Route
						key={index}
						path={route.path}
						exact={route.exact}
						component={route.main}
						className={css.view}
					/>
				)}
			</div>
		</div>
	</Router>

export default Sidenav
