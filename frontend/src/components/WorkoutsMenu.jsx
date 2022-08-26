import React, {useEffect, useState} from 'react';

import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Navbar';
import Navbar from 'react-bootstrap/Navbar';

import {
	GetWorkouts,
	GetWorkoutWithExercises,
	NewWorkout,
} from '../controllers/build/WorkoutsMenu';
import InfiniteScroll from "./InfiniteScroll";
import MenuBar from './MenuBar';

import arrowleft from '../assets/icons/arrow-90deg-left.svg';
import back from '../assets/icons/arrow-left.svg';
import pencil from '../assets/icons/pencil.svg';
import pluscircle from '../assets/icons/plus-circle.svg';
import search from '../assets/icons/search.svg';

function WorkoutModal(props) {
	return (
		<Modal
			show={props.show}
			onHide={props.onHide}
			animation={false}
			aria-labelledby="contained-modal-title-vcenter"
			centered
		>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Add Workout
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<InputGroup className="mb-3">
					<InputGroup.Text>Workout name</InputGroup.Text>
					<FormControl value={props.workoutName} onChange={props.workoutNameChangeHandler}/>
				</InputGroup>
				{props.workoutExercises.map((exercise, index) => (
				<InputGroup key={index} className="mb-3">
					<InputGroup.Text>Exercise {index+1}</InputGroup.Text>
					<FormControl value={exercise.name} onChange={(event) => props.workoutExercisesChangeHandler(event, index)}/>
				</InputGroup>
				))}
				<InputGroup className="mb-3">
					<Button variant="outline-success" onClick={props.workoutExercisesAddHandler}>Add Exercise</Button>
				</InputGroup>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={props.submitWorkoutHandler}>Submit</Button>
			</Modal.Footer>
		</Modal>
	);
}

function WorkoutsMenu(props) {
	const [error, setError] = useState("");
	const [loading, setLoading] = InfiniteScroll(loadMoreItems);
	const [newWorkout, setNewWorkout] = useState(false);
	const [workoutPage, setWorkoutPage] = useState(false);
	const [newWorkoutName, setNewWorkoutName] = useState("");
	const [newWorkoutExercises, setNewWorkoutExercises] = useState([]);
	const [onReload, setOnReload] = useState(true);
	const [onStart, setOnStart] = useState(true);
	const [page, setPage] = useState(0);
	const [workouts, setWorkouts] = useState([]);
	const [workoutID, setWorkoutID] = useState(0);
	const [workoutName, setWorkoutName] = useState("");
	const [workoutExercises, setWorkoutExercises] = useState([]);
	const [workoutWithExercises, setWorkoutWithExercises] = useState({});

	useEffect(() => {
		if (onStart) {
			setOnReload(false);
			getWorkouts();
		}
	}, [onStart]);

	useEffect(() => {
		if (!onStart && !onReload) {
			if (window.innerHeight === document.documentElement.offsetHeight) {
				getWorkouts();
			}
		}
	}, [page]);

	function loadMoreItems() {
		getWorkouts();
		setLoading(false);
	}

	const reload = () => {
		setOnReload(true);
		setWorkouts([]);
		setPage(0);
		setOnStart(true);
	};

	const getWorkouts = () => {
		GetWorkouts(page).then((result) => {
			setOnStart(false);
			const count = result.length;
			setWorkouts([...workouts, ...result]);
			if (count > 0) {
				setPage(page + 1);
			}
		}).catch((err) => {
			setError(err);
		});
	};

	const getWorkoutWithExercises = (id) => {
		setError("Getting workout with exercises");
		GetWorkoutWithExercises(id).then((result) => {
			console.log(result);
			setWorkoutWithExercises(result);
			setError("");
		}).catch((err) => {
			setError(err);
		});
	};

	const resetWorkout = () => {
		setWorkoutID(0);
		setWorkoutName("");
		setWorkoutExercises([]);
	}

	const closeNewWorkout = () => {
		setNewWorkoutName("");
		setNewWorkout(false);
		setNewWorkoutExercises([]);
	};

	const openNewWorkout = () => {
		setNewWorkout(true);
	};

	const newWorkoutSubmit = () => {
		NewWorkout({name: newWorkoutName}).catch((err) => {
			setError(err);
		});
		closeNewWorkout();
		reload();
	};

	const newWorkoutNameChange = event => {
		setNewWorkoutName(event.target.value);
	};

	const newWorkoutExercisesChange = (event, index) => {
		console.log(index, event.target.value)
	};

	const newWorkoutExercisesAdd = event => {
		// TODO: get exercises, store in exercises variable
		// TODO: add first element from exercises array
		// TODO: display exercises list in modal, title is name of exercise at that index
		setNewWorkoutExercises([...newWorkoutExercises, {name: "test exercise"}]);
	};

	const closeWorkoutPage = () => {
		resetWorkout();
		setWorkoutPage(false);
	};

	const openWorkoutPage = (event) => {
		const index = event.target.getAttribute('value');
		//setWorkoutName(workouts[index].id);
		getWorkoutWithExercises(workouts[index].id);
		setWorkoutPage(true);
	};

	if (error !== "") {
		return (
			<>
				<h1>Error: {error}</h1>
			</>
		); 
	}

	if (workoutPage) {
		return (
			<>
				<p>Date: {workoutWithExercises.date}</p>
				<p>ID: {workoutWithExercises.id}</p>
				{workoutWithExercises.exercises.map((record, index) => (
					<p>Result ID: {record.result.id}, Exercise ID: {record.exercise.id}, Exercise Name: {record.exercise.name}</p>
				))}
			</>
		);
	}

	return (
		<>
			<MenuBar title={"Workouts"} leftIcon={back} leftClick={props.back} rightIcon={pluscircle} rightClick={openNewWorkout}/>
			<ListGroup variant="flush" className="MenuList">
				{workouts.map((workout, index) => (
				<ListGroup.Item key={index} value={index} action onClick={openWorkoutPage}>
					<div className="MenuListDivLeft" value={index}>
						{workout.date}
					</div>
					<div className="MenuListDivRight">
						<img className="MenuListIcon" src={pencil} value={index} onClick={openWorkoutPage}/>
					</div>
				</ListGroup.Item>
				))}
			</ListGroup>
			<WorkoutModal title={"Add Workout"} show={newWorkout} onHide={closeNewWorkout} workoutName={newWorkoutName} workoutNameChangeHandler={newWorkoutNameChange} workoutExercises={newWorkoutExercises} workoutExercisesAddHandler={newWorkoutExercisesAdd} workoutExercisesChangeHandler={newWorkoutExercisesChange} submitWorkoutHandler={newWorkoutSubmit}/>
		</>
	);
}

export default WorkoutsMenu;
