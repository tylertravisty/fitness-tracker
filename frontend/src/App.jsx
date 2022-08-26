import {useState} from 'react';

import {
	MemoryRouter as Router,
	Route,
	Routes,
	Link
} from "react-router-dom";

import MainMenu from './components/MainMenu';
import Navigation, {
	NavHome,
	NavMainMenu
} from './components/Navigation';
import Workouts from './components/Workouts';

import './App.css';
import './assets/styles/bootstrap.min.css';

function App() {
    return (
		<Router>
			<Routes>
				<Route path={NavMainMenu} element={<MainMenu />} />
				<Route path={NavHome} element={<Workouts />} />
			</Routes>
		</Router>
    )
}

export default App
