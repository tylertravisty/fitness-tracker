import React, {useState} from 'react';

import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

import arrowleft from '../assets/icons/arrow-90deg-left.svg';
import pluscircle from '../assets/icons/plus-circle.svg';

import ExercisesMenu from './ExercisesMenu';
import MenuBar from './MenuBar';
import Navigation from './Navigation';
import WorkoutsMenu from './WorkoutsMenu';
import "./MainMenu.css";

import {
	NavMainMenu
} from './Navigation';


function MainMenu() {
	const [exercisesMenu, setExercisesMenu] = useState(false);
	const [workoutsMenu, setWorkoutsMenu] = useState(false);
	const [name, setName] = useState(NavMainMenu);

	const closeExercisesMenu = () => {
		setExercisesMenu(false)
	};

	const openExercisesMenu = () => {
		setExercisesMenu(true)
	};

	const closeWorkoutsMenu = () => {
		setWorkoutsMenu(false)
	};

	const openWorkoutsMenu = () => {
		setWorkoutsMenu(true)
	};

	const reset = () => {
		setExercisesMenu(false);
		setWorkoutsMenu(false);
		setName(NavMainMenu);
	};

	if (exercisesMenu) {
		return (
			<div className="Menu">
				<ExercisesMenu back={closeExercisesMenu}/>
				<Navigation parent={name} reset={reset}/>
			</div>
		);
	}

	if (workoutsMenu) {
		return (
			<div className="Menu">
				<WorkoutsMenu back={closeWorkoutsMenu}/>
				<Navigation parent={name} reset={reset}/>
			</div>
		);
	}

	return(
		<div className="Menu">
			<MenuBar title={"Main Menu"} />
			<ListGroup variant="flush" className="MenuList">
				<ListGroup.Item action onClick={openExercisesMenu}>Exercises</ListGroup.Item>
				<ListGroup.Item action onClick={openWorkoutsMenu}>Workouts</ListGroup.Item>
			</ListGroup>
			<Navigation parent={name}/>
		</div>
	);
}

export default MainMenu;
