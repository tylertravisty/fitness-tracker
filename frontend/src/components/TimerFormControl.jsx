import React, {useEffect, useState} from 'react';

import Form from 'react-bootstrap/Form';

import "./TimerFormControl.css";

const Numbers = '0123456789';

const TimerString = (timer) => {
	if (timer === null) {
		return "00:00:00";
	}

	return timer.substring(0,2) + ":" + timer.substring(2, 4) + ":" + timer.substring(4);
}

const ValidTimer = (timer) => {
	let valid = true;
	timer.split("").forEach(i => {
		if (!Numbers.includes(i)) {
			valid = false;
		}
	});

	return valid;
}

function TimerFormControl(props) {
	const [position, setPosition] = useState(6);
	const [timerS, setTimerS] = useState(TimerString(props.value));

	const BackspaceHandler = (event) => {
		if (position > 5 || event.code !== "Backspace") {
			return;
		}


		let shift = props.value.substring(0, 5);
		let newTimer = "0" + shift;
		if (position > 4) {
			props.onChange(null);
		} else {
			props.onChange(newTimer);
		}

		let newTimerS = TimerString(newTimer);
		setTimerS(newTimerS);
		setPosition(position+1);
	}

	const TimerHandler = (event) => {
		if (position <= 0) {
			return;
		}

		let t = event.target.value;

		if (!Numbers.includes(t)) {
			return;
		}

		if (t === "0" && props.value === null) {
			return;
		}

		let shift = "00000";
		if (props.value !== null) {
			shift = props.value.substring(1);
		}
		let newTimer = shift + t;
		props.onChange(newTimer);

		let newTimerS = TimerString(newTimer);
		setTimerS(newTimerS);
		setPosition(position-1);
	}

	if (props.value === null) {
		return (
			<Form.Control value="" placeholder={timerS} onChange={TimerHandler} disabled={props.disabled}/>
		);
	}

	if (props.value.length !== 6) {
		throw new Error("Invalid timer: timer must be 6 digits long.");
	}

	if (!ValidTimer(props.value)) {
		throw new Error("Invalid timer: timer can only contain numerical digits.")
	}

	// props.value checks
	// 1. length === 6
	// 2. only numbers
	
	return (
		<Form.Control className="TimerActive" value="" placeholder={timerS} onChange={TimerHandler} onKeyDown={BackspaceHandler} disabled={props.disabled}/>
	);
}

export default TimerFormControl;
