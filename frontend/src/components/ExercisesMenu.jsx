import React, {useEffect, useState} from 'react';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Row from 'react-bootstrap/Row'

import {
	GetExercises,
	NewExercise,
	UpdateExercise,
} from '../controllers/build/ExercisesMenu';

import MenuBar from './MenuBar';

import InfiniteScroll from "./InfiniteScroll";

import arrowleft from '../assets/icons/arrow-90deg-left.svg';
import back from '../assets/icons/arrow-left.svg';
import pencil from '../assets/icons/pencil.svg';
import pluscircle from '../assets/icons/plus-circle.svg';
import search from '../assets/icons/search.svg';

function ExerciseModal(props) {
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
					{props.title}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<InputGroup className="mb-3">
					<InputGroup.Text>Exercise name</InputGroup.Text>
					<FormControl value={props.name} onChange={(event) => props.setName(event.target.value)}/>
				</InputGroup>
				<Form.Check inline type="checkbox" label="Calories" onChange={(event) => props.setCalories(event.target.checked)} checked={props.calories}/>
				<Form.Check inline type="checkbox" label="Distance" onChange={(event) => props.setDistance(event.target.checked)} checked={props.distance}/>
				<Form.Check inline type="checkbox" label="Reps" onChange={(event) => props.setReps(event.target.checked)} checked={props.reps}/>
				<Form.Check inline type="checkbox" label="Time" onChange={(event) => props.setTime(event.target.checked)} checked={props.time}/>
				<Form.Check inline type="checkbox" label="Weight" onChange={(event) => props.setWeight(event.target.checked)} checked={props.weight}/>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={props.submit}>Submit</Button>
			</Modal.Footer>
		</Modal>
	);
}

function ExercisesMenu(props) {
	const [error, setError] = useState("");
	const [exercises, setExercises] = useState([]);
	const [exerciseID, setExerciseID] = useState(0);
	const [exerciseName, setExerciseName] = useState("");
	const [exerciseCalories, setExerciseCalories] = useState(false);
	const [exerciseDistance, setExerciseDistance] = useState(false);
	const [exerciseReps, setExerciseReps] = useState(false);
	const [exerciseTime, setExerciseTime] = useState(false);
	const [exerciseWeight, setExerciseWeight] = useState(false);
	const [editExercise, setEditExercise] = useState(false);
	const [loading, setLoading] = InfiniteScroll(loadMoreItems);
	const [newExercise, setNewExercise] = useState(false);
	const [onReload, setOnReload] = useState(false);
	const [onStart, setOnStart] = useState(true);
	const [page, setPage] = useState(0);

	useEffect(() => {
		if (onStart) {
			setOnReload(false);
			getExercises();
		}
	}, [onStart]);

	useEffect(() => {
		if (!onStart && !onReload) {
			if (window.innerHeight === document.documentElement.offsetHeight) {
				getExercises();
			}
		}
	}, [page]);

	const getExercises = () => {
		GetExercises(page).then((result) => {
			setOnStart(false);
			const count = result.length;
			setExercises([...exercises, ...result]);
			if (count > 0) {
				setPage(page + 1);
			}
		}).catch((err) => {
			setError(err);
		});
	};

	function loadMoreItems() {
		getExercises();
		setLoading(false);
	}

	const reload = () => {
		setOnReload(true);
		setExercises([]);
		setPage(0);
		setOnStart(true);
	};

	const resetExercise = () => {
		setExerciseID(0);
		setExerciseName("");
		setExerciseCalories(false);
		setExerciseDistance(false);
		setExerciseReps(false);
		setExerciseTime(false);
		setExerciseWeight(false);
		setEditExercise(false);
	}

	const closeNewExercise = () => {
		resetExercise();
		setNewExercise(false);
	};

	const openNewExercise = () => {
		setNewExercise(true);
	};

	const submitNewExercise = () => {
		closeNewExercise();
		setError("Submitting new exercise...");
		NewExercise({name: exerciseName, calories: exerciseCalories, distance: exerciseDistance, reps: exerciseReps, time: exerciseTime, weight: exerciseWeight}).then(() => {
			setError("");
			reload();
		}).catch((err) => {
			setError(err);
		});
	};

	const closeEditExercise = () => {
		resetExercise();
		setEditExercise(false);
	};

	const openEditExercise = (event) => {
		const index = event.target.getAttribute('value');
		setExerciseID(exercises[index].id);
		setExerciseName(exercises[index].name);
		setExerciseCalories(exercises[index].calories);
		setExerciseDistance(exercises[index].distance);
		setExerciseReps(exercises[index].reps);
		setExerciseTime(exercises[index].time);
		setExerciseWeight(exercises[index].weight);
		setEditExercise(true);
	};

	const submitEditExercise = () => {
		closeEditExercise();
		setError("Submitting edit exercise...");
		UpdateExercise({id: exerciseID, name: exerciseName, calories: exerciseCalories, distance: exerciseDistance, reps: exerciseReps, time: exerciseTime, weight: exerciseWeight}).then(() => {
			setError("");
			reload();
		}).catch((err) => {
			setError(err);
		});
	};

	if (error !== "") {
		return (
			<>
				<h1>Error: {error}</h1>
			</>
		); 
	}

	return (
		<>
		<MenuBar title={"Exercises"} leftIcon={back} leftClick={props.back} rightIcon={pluscircle} rightClick={openNewExercise}/>
		<ListGroup variant="flush" className="MenuList">
			{exercises.map((exercise, index) => (
			<ListGroup.Item key={index}>
				<div className="MenuListDivLeft">
					{exercise.name}
				</div>
				<div className="MenuListDivRight">
					<img className="MenuListIcon" src={pencil} value={index} onClick={openEditExercise}/>
				</div>
			</ListGroup.Item>
			))}
		</ListGroup>
			<ExerciseModal title={"New Exercise"} show={newExercise} onHide={closeNewExercise} name={exerciseName} setName={setExerciseName} calories={exerciseCalories} setCalories={setExerciseCalories} distance={exerciseDistance} setDistance={setExerciseDistance} reps={exerciseReps} setReps={setExerciseReps} time={exerciseTime} setTime={setExerciseTime} weight={exerciseWeight} setWeight={setExerciseWeight} submit={submitNewExercise}/>
			<ExerciseModal title={"Edit Exercise"} show={editExercise} onHide={closeEditExercise} name={exerciseName} setName={setExerciseName} calories={exerciseCalories} setCalories={setExerciseCalories} distance={exerciseDistance} setDistance={setExerciseDistance} reps={exerciseReps} setReps={setExerciseReps} time={exerciseTime} setTime={setExerciseTime} weight={exerciseWeight} setWeight={setExerciseWeight} submit={submitEditExercise}/>
		</>
	);
}

export default ExercisesMenu;
