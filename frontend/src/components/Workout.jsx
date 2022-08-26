import React, {useEffect, useState} from 'react';

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
	const [timer, setTimer] = useState("000000");

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
				{props.workout.exercises.map((record, index) => (
				<ListGroup variant="flush" className="MenuList">
					<ListGroup.Item>
						<Row>
							<b>{record.exercise.name}</b>
							{record.exercise.calories &&
							<Col xs={4}>
								<Form.Control placeholder="Calories" disabled/>
							</Col>
							}
							{record.exercise.distance &&
							<Col xs={4}>
								<Form.Control placeholder="Distance" disabled/>
							</Col>
							}
							{record.exercise.reps &&
							<Col xs={4}>
								<Form.Control placeholder="Reps" disabled/>
							</Col>
							}
							{record.exercise.time &&
							<Col xs={4}>
								<TimerFormControl onChange={setTimer} value={record.result.time} disabled={true} />
							</Col>
							}
							{record.exercise.weight &&
							<Col xs={4}>
								<Form.Control placeholder="Weight" disabled/>
							</Col>
							}
						</Row>
					</ListGroup.Item>
				</ListGroup>
				))}
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
			{props.workout.exercises.map((record, index) => (
			<ListGroup variant="flush" className="MenuList">
				<ListGroup.Item>
					<Row>
						<b>{record.exercise.name}</b>
						{record.exercise.calories &&
						<Col xs={6} sm="auto">
							<InputGroup size="sm" className="mb-3">
								<InputGroup.Text id="inputGroup-sizing-sm">Calories</InputGroup.Text>
								<Form.Control onChange={(event) => props.workoutExerciseChange(index, "calories", event.target.value)} placeholder="Calories" value={record.result.calories}/>
							</InputGroup>
						</Col>
						}
						{record.exercise.distance &&
						<Col xs={6} sm="auto">
							<InputGroup size="sm" className="mb-3">
								<InputGroup.Text id="inputGroup-sizing-sm">Distance</InputGroup.Text>
								<Form.Control onChange={(event) => props.workoutExerciseChange(index, "distance", event.target.value)} placeholder="Distance" value={record.result.distance}/>
							</InputGroup>
						</Col>
						}
						{record.exercise.reps &&
						<Col xs={6} sm="auto">
							<InputGroup size="sm" className="mb-3">
								<InputGroup.Text id="inputGroup-sizing-sm">Reps</InputGroup.Text>
								<Form.Control placeholder="Reps" value={record.result.reps} value={null}/>
							</InputGroup>
						</Col>
						}
						{record.exercise.time &&
						<Col xs={6} sm="auto">
							<InputGroup size="sm" className="mb-3">
								<InputGroup.Text id="inputGroup-sizing-sm">Time</InputGroup.Text>
								<TimerFormControl onChange={setTimer} value={record.result.time} disabled={false}/>
							</InputGroup>
						</Col>
						}
						{record.exercise.weight &&
						<Col xs={6} sm="auto">
							<InputGroup size="sm" className="mb-3">
								<InputGroup.Text id="inputGroup-sizing-sm">Weight</InputGroup.Text>
								<Form.Control placeholder="Weight" value={record.result.weight}/>
							</InputGroup>
						</Col>
						}
					</Row>
				</ListGroup.Item>
			</ListGroup>
			))}
		</>
	);
}

export default Workout;
