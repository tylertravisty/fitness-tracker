import React, {useEffect, useState} from 'react';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';

import WorkoutInput from './WorkoutInput';
import TimerFormControl from './TimerFormControl';

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

function Workout(props) {
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
			</>
		);
	}

	let dateS = ParseDate(props.workout.date);
	return (
		<>
			<ListGroup variant="flush" className="MenuList">
				<ListGroup.Item>
					<b>{props.workout.title}</b><br/>
					{dateS}
				</ListGroup.Item>
			</ListGroup>
			<WorkoutInput exercises={props.workout.exercises} exerciseChange={props.workoutExerciseChange} />
			<ListGroup variant="flush">
				<ListGroup.Item className="d-flex justify-content-center">
					<Button variant="primary" onClick={props.submitWorkoutHandler}>Submit</Button>
				</ListGroup.Item>
			</ListGroup>
		</>
	);
}

export default Workout;
