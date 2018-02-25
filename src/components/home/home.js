import React from 'react';
import { Header } from 'semantic-ui-react';

import { h1 } from './home.css';

const Home = () => {
	return (
		<Header as="h1" className={h1}>
			Hello world
		</Header>
	)
}

export default Home;
