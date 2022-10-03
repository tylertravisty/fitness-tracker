import React, {useEffect, useState} from 'react';

import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';

import DecimalFormControl from './DecimalFormControl';
import TimerFormControl from './TimerFormControl';

import './WorkoutInput.css';

function WorkoutInput(props) {
	const nullToEmpty = (value) => {
		if (value === null) {
			return "";
		}

		return value;
	};

	const onChangeNum = (index, type, value) => {
		if (value === null || value === "") {
			props.exerciseChange(index, type, null);
			return;
		}

		// Values cannot have more than 16 digits
		if (value.length > 16) {
			return;
		}

		let num = Number(value);
		if (isNaN(num)) {
			return;
		}

		if (!Number.isInteger(num)) {
			return;
		}

		props.exerciseChange(index, type, num)
	};

	const timeIntToString = (time) => {
		if (time === null) {
			return null;
		}

		let h = Math.floor(time / 3600);
		let m = Math.floor(time % 3600 / 60);
		let s = Math.floor(time % 3600 % 60);

		return ('0' + h).slice(-2) + ('0' + m).slice(-2) + ('0' + s).slice(-2);
	};

	const timeStringToInt = (timeS) => {
		if (timeS === null) {
			return null;
		}

		let hh = timeS.substring(0,2);
		let mm = timeS.substring(2, 4);
		let ss = timeS.substring(4);

		let h = Number(hh);
		let m = Number(mm);
		let s = Number(ss);

		return (h * 3600) + (m * 60) + (s);
	};

	const onChangeTime = (index, timeS) => {
		let time = timeStringToInt(timeS);

		props.exerciseChange(index, "time", time)
	};

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
								<InputGroup.Text className="CaloriesInput" id="inputGroup-sizing-sm"><b>Calories</b></InputGroup.Text>
								<Form.Control onChange={(event) => onChangeNum(index, "calories", event.target.value)} placeholder="Calories" value={nullToEmpty(record.result.calories)} disabled={props.disabled} />
							</InputGroup>
						</Col>
						}
						{record.exercise.distance &&
						<Col xs={6} sm="auto">
							<InputGroup size="sm" className="mb-3">
								<InputGroup.Text className="DistanceInput" id="inputGroup-sizing-sm"><b>Distance</b></InputGroup.Text>
								<DecimalFormControl onChange={props.exerciseChange} placeholder={"Distance"} value={nullToEmpty(record.result.distance)} index={index} type={"distance"} disabled={props.disabled} />
							</InputGroup>
						</Col>
						}
						{record.exercise.reps &&
						<Col xs={6} sm="auto">
							<InputGroup size="sm" className="mb-3">
								<InputGroup.Text className="RepsInput" id="inputGroup-sizing-sm"><b>Reps</b></InputGroup.Text>
								<Form.Control onChange={(event) => onChangeNum(index, "reps", event.target.value)} placeholder="Reps" value={nullToEmpty(record.result.reps)} disabled={props.disabled} />
							</InputGroup>
						</Col>
						}
						{record.exercise.time &&
						<Col xs={6} sm="auto">
							<InputGroup size="sm" className="mb-3">
								<InputGroup.Text className="TimeInput" id="inputGroup-sizing-sm"><b>Time</b></InputGroup.Text>
								<TimerFormControl onChange={(timeS) => onChangeTime(index, timeS)} value={timeIntToString(record.result.time)} disabled={props.disabled}/>
							</InputGroup>
						</Col>
						}
						{record.exercise.weight &&
						<Col xs={6} sm="auto">
							<InputGroup size="sm" className="mb-3">
								<InputGroup.Text className="WeightInput" id="inputGroup-sizing-sm"><b>Weight</b></InputGroup.Text>
								<Form.Control onChange={(event) => onChangeNum(index, "weight", event.target.value)} placeholder="Weight" value={nullToEmpty(record.result.weight)} disabled={props.disabled} />
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
