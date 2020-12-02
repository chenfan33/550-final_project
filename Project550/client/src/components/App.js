import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Recommendations from './Recommendations';
import Login from './Login'
import Dashboard from "./Dashboard";
import Search from "./Search";
export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route
							exact
							path="/"
							render={() => (
								<Login />
							)}
						/>
						<Route
							exact
							path="/recommendations"
							render={() => (
								<Recommendations />
							)}
						/>
						<Route
							exact
							path="/login"
							render={() => (
								<Login />
							)}
						/>
						<Route
							exact
							path="/signup"
							render={() => (
								<Login />
							)}
						/>
						<Route
							exact
							path="/addAccount"
							render={() => (
								<Login />
							)}
						/>

            <Route exact path="/dashboard" render={() => <Dashboard />} />
            <Route exact path="/search" render={() => <Search />} />
					</Switch>
				</Router>
			</div>
		);
	}
}