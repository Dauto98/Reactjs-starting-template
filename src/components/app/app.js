import React from 'react';
import { Switch, BrowserRouter, Route, Link } from 'react-router-dom';

import { Divider } from 'semantic-ui-react';

import Home from '../home/home.js';

const App = () => {
  return (
		<BrowserRouter>
			<div>
				<nav>
					<Link to='/'>Home</Link>
				</nav>
				<Divider />
				<Switch>
					<Route exact path="/" component={Home} />
				</Switch>
			</div>
		</BrowserRouter>
  );
};

export default App;
