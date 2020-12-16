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
import Subpage from "./Subpage";
import Bookshelf from "./Bookshelf"

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
								<Dashboard />
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
						<Route
							path="/bookshelf"
							render={() => (
								<Bookshelf />
							)}
						/>

            <Route exact path="/dashboard" render={() => <Dashboard />} />
            <Route exact path="/search" render={() => <Search />} />
			<Route path="/subpage" render={()=><Subpage />} />
					</Switch>
				</Router>
			</div>
		);
	}
}