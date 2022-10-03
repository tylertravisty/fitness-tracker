import React, {useEffect, useState} from 'react';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';

import WorkoutInput from './WorkoutInput';
import TimerFormControl from './TimerFormControl';

import {
	GetAllExercises,
} from '../controllers/build/ExercisesMenu';

import "./Workout.css";

function ParseDate(datetime) {
	let ymd = datetime.substring(0,10);
	let time = datetime.substring(11, 16);
	let timezone = datetime.substring(17, 22);
	let date = new Date(ymd + "T" + time + ":00" + timezone);

	let day = new Intl.DateTimeFormat('en-US', {weekday:'long'}).format(date);

	let month = new Intl.DateTimeFormat('en-US', {month:'long'}).format(date);

	let timeS = datetime.substring(11, 16) + " " + datetime.substring(23);

	let dateS = day + ", " + month + " " + date.getDate() + ", " + date.getFullYear() + " " + timeS;

	return dateS;
}

function AddExerciseModal(props) {
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
					{props.header}
				</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form.Select onChange={(event) => {props.exerciseChangeHandler(event.target.value)}}>
					<option selected disabled>Select exercise:</option>
				{props.exercises.map((exercise, index) => (
					<option value={index}>{exercise.name}</option>
				))}
				</Form.Select>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="success" onClick={props.submit}>Add</Button>
			</Modal.Footer>
		</Modal>
	);
}

function ErrorModal(props) {
	return (
		<Modal
			show={props.show}
			onHide={props.onHide}
			animation={false}
			aria-labelledby="contained-modal-title-vcenter"
			backdrop="static"
			centered
			size="sm"
		>
			<Modal.Body className="ErrorModalBody">
				<h4>Error</h4>
				<span className="ErrorModalBodyText">
					Something went wrong!<br/>
					"{props.error}"
				</span>
			</Modal.Body>
			<Modal.Footer className="ErrorModalFooter">
				<ListGroup.Item className="ErrorModalDismiss" action onClick={props.onHide}>
					<h6>Dismiss</h6>
				</ListGroup.Item>
			</Modal.Footer>
		</Modal>
	);
}

function Workout(props) {
	const [addExercise, setAddExercise] = useState(false);
	const [error, setError] = useState("");
	const [exercise, setExercise] = useState({});
	const [exercises, setExercises] = useState([]);

	const openAddExercise = () => {
		getAllExercises();
		setAddExercise(true);
	};

	const closeAddExercise = () => {
		setExercise({});
		setExercises([]);
		setAddExercise(false);
	};

	const addExerciseChange = (value) => {
		setExercise(exercises[value]);
	};

	const addExerciseSubmit = () => {
		props.exerciseAdd(exercise);
		closeAddExercise();
	};

	const getAllExercises = () => {
		GetAllExercises().then((result) => {
			setExercises(result);
		}).catch((err) => {
			setError(err);
		});
	};

	const closeError = () => {
		setError("");
	}

	if (props.edit) {
		return (
			<>
				<ListGroup variant="flush" className="MenuList">
					<ListGroup.Item>
						<Form.Control value={props.workout.title} onChange={props.titleChange} placeholder="Title"/>
						<InputGroup>
							<FormControl value={props.date} onChange={props.dateChange} placeholder="Date" type="date"/>
							<FormControl value={props.time} onChange={props.timeChange} placeholder="Time" type="time"/>
						</InputGroup>
					</ListGroup.Item>
				</ListGroup>
				<WorkoutInput exercises={props.workout.exercises} exerciseChange={props.workoutExerciseChange} disabled={true}/>
				<ListGroup variant="flush">
					<ListGroup.Item className="d-flex justify-content-center">
						<Button variant="success" onClick={openAddExercise}>Add Exercise</Button>
					</ListGroup.Item>
				</ListGroup>
				<AddExerciseModal header={"Add Exercise"} show={addExercise} onHide={closeAddExercise} exercises={exercises} exerciseChangeHandler={addExerciseChange} submit={addExerciseSubmit} />
				<ErrorModal show={error !== ""} onHide={closeError} error={error} />
			</>
		);
	}

	let dateS = ParseDate(props.workout.date);
	return (
		<>
			<ListGroup variant="flush" className="MenuList">
				<ListGroup.Item className="d-flex justify-content-between align-items-start">
					<div>
						<div className="BoldTitle">{props.workout.title}</div>
						<div className="ColorDate">{dateS.substring(0, dateS.length-16)}</div>
					</div>
					<div className="ColorTime">
						{props.workout.date.substring(11, 16) + props.workout.date.substring(22)}
					</div>
				</ListGroup.Item>
			</ListGroup>
			<WorkoutInput exercises={props.workout.exercises} exerciseChange={props.workoutExerciseChange} />
			<ListGroup variant="flush">
				<ListGroup.Item className="d-flex justify-content-center">
					<Button variant="primary" onClick={props.submitWorkoutHandler}>Submit</Button>
				</ListGroup.Item>
			</ListGroup>
			<ErrorModal show={error !== ""} onHide={closeError} error={error} />
		</>
	);
}

export default Workout;
