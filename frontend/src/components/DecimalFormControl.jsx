import {useState} from 'react';

import Form from 'react-bootstrap/Form';

function DecimalFormControl(props) {
	const [decimal, setDecimal] = useState(false);
	const [decimalZero, setDecimalZero] = useState(false);
	const [zeroDecimal, setZeroDecimal] = useState(false);

	const addDecimal = (value) => {
		if (decimal) {
			return value + ".";
		}

		if (decimalZero) {
			return value + ".0";
		}

		if (zeroDecimal) {
			return "0.";
		}

		return value;
	}

	const onChangeDec = (index, type, value) => {
		console.log(value);
		if (value === null || value === "") {
			props.onChange(index, type, null);
			return;
		}

		if(value === ".") {
			setZeroDecimal(true);
		} else {
			setZeroDecimal(false);
		}

		if (value.endsWith(".") && value !== ".") {
			setDecimal(true);
		} else {
			setDecimal(false);
		}

		if (value.endsWith(".0")) {
			setDecimalZero(true);
		} else {
			setDecimalZero(false);
		}

		// Values cannot have more than 16 digits
		if (value.length > 16) {
			return;
		}

		let check = value;
		if (value === ".") {
			check = "0."
		}

		let num = Number(check);
		if (isNaN(num)) {
			return;
		}

		props.onChange(index, type, num)
	};

	return (
		<Form.Control value={addDecimal(props.value)} placeholder={props.placeholder} onChange={(event) => onChangeDec(props.index, props.type, event.target.value)} disabled={props.disabled}/>
	);
}

export default DecimalFormControl;
