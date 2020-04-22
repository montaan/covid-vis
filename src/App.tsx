import React from 'react';
import {
	HashRouter as Router,
	Route,
	Switch,
} from 'react-router-dom';
import { QFrameAPI } from './lib/api';

import Montaan from './Montaan';

import './App.css';

const APIServer = document.location.origin.replace(/(:\d+)$/, ':8008') + '/_';

interface AppProps {}

interface AppState {
	authHeaders: any;
	userInfo: any;
	api: QFrameAPI;
	firstFetchDone: boolean;
	showHelp: boolean;
}

class App extends React.Component<AppProps, AppState> {
	history: any;

	constructor(props: any) {
		super(props);
		this.state = {
			authHeaders: {},
			userInfo: {},
			firstFetchDone: false,
			showHelp: false,
			api: new QFrameAPI(APIServer),
		};
		this.authHeaders = this.state.authHeaders;
	}

	authHeaders = {};

	fetchUserDetails = async () => ({});

	goHome() {
		// Not bound to App on purpose, to let subcomponents access Router.
		this.history.push('/');
	}

	showHelp = (ev: MouseEvent) => {
		ev.preventDefault();
		this.setState({ showHelp: !this.state.showHelp });
	};

	render() {
		return (
			<Router basename={process.env.PUBLIC_URL}>
				<div className="App">
					<main>
						<Switch>
							<Route
								path="/"
								component={() => (
									<Montaan
										api={this.state.api}
										apiPrefix={this.state.api.server}
										userInfo={this.state.userInfo}
									/>
								)}
							/>
						</Switch>
					</main>
				</div>
			</Router>
		);
	}
}

export default App;
