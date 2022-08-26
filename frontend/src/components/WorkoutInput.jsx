import React, {useEffect, useState} from 'react';

import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';

import TimerFormControl from './TimerFormControl';

function WorkoutInput(props) {
	return (
		<>
			{props.exercises.map((record, index) => (
			<ListGroup variant="flush" className="MenuList">
				<ListGroup.Item>
					<Row>
						<b>{record.exercise.name}</b>
						{record.exercise.calories &&
						<Col xs={6} sm="auto">
							<InputGroup size="sm" className="mb-3">
								<InputGroup.Text id="inputGroup-sizing-sm">Calories</InputGroup.Text>
								<Form.Control onChange={(event) => props.exerciseChange(index, "calories", event.target.value)} placeholder="Calories" value={record.result.calories}/>
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
								<TimerFormControl value={record.result.time} disabled={false}/>
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


export default WorkoutInput;
