import React, {useEffect, useState} from 'react';

import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Navbar';
import Navbar from 'react-bootstrap/Navbar';

import "./Workouts.css";

import {
	NavHome
} from './Navigation';

import {
	EditWorkout,
	GetWorkouts,
	GetWorkoutWithExercises,
	NewWorkout,
	UpdateWorkout,
	UpdateWorkoutWithExercises,
} from '../controllers/build/WorkoutsMenu';
import InfiniteScroll from "./InfiniteScroll";
import MenuBar from './MenuBar';
import Navigation from './Navigation';
import Workout from './Workout';

import arrowleft from '../assets/icons/arrow-90deg-left.svg';
import back from '../assets/icons/arrow-left.svg';
import blank from '../assets/icons/blank.svg';
import cancel from '../assets/icons/x.svg';
import pencil from '../assets/icons/pencilsquare.svg';
import pluscircle from '../assets/icons/plus-circle.svg';
import save from '../assets/icons/check2-square.svg';
import search from '../assets/icons/search.svg';

function NewWorkoutModal(props) {
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
				<InputGroup className="mb-3">
					<InputGroup.Text>Workout title</InputGroup.Text>
					<FormControl value={props.workoutTitle} onChange={(event) => {props.workoutTitleChangeHandler(event.target.value)}}/>
				</InputGroup>
			</Modal.Body>
			<Modal.Footer>
				<Button onClick={props.submitWorkoutHandler}>Submit</Button>
			</Modal.Footer>
		</Modal>
	);
}

function Workouts(props) {
	const [error, setError] = useState("");
	const [loading, setLoading] = InfiniteScroll(loadMoreItems);
	const [newWorkout, setNewWorkout] = useState(false);
	const [workoutPage, setWorkoutPage] = useState(false);
	const [workoutPageEdit, setWorkoutPageEdit] = useState(false);
	const [onReload, setOnReload] = useState(true);
	const [onReloadWorkout, setOnReloadWorkout] = useState(false);
	const [onStart, setOnStart] = useState(true);
	const [page, setPage] = useState(0);
	const [workouts, setWorkouts] = useState([]);
	const [workoutID, setWorkoutID] = useState(0);
	const [workoutDate, setWorkoutDate] = useState("");
	const [origWorkoutDate, setOrigWorkoutDate] = useState("");
	const [workoutTitle, setWorkoutTitle] = useState("");
	const [origWorkoutTitle, setOrigWorkoutTitle] = useState("");
	const [workoutExercises, setWorkoutExercises] = useState([]);
	const [origWorkoutExercises, setOrigWorkoutExercises] = useState([]);
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
			setWorkoutWithExercises(result);
			setError("");
		}).catch((err) => {
			setError(err);
		});
	};

	const updateWorkout = (workout) => {
		setError("Updating workout");
		UpdateWorkout(workout).then(() => {
			setError("");
		}).catch((err) => {
			setError(err);
		});
	};

	const updateWorkoutAddExercises = (workout) => {
		setError("Updating workout");
		EditWorkout(workout).then(() => {
			setError("");
		}).catch((err) => {
			setError(err);
		});

		getWorkoutWithExercises(workout.id);
	};

	const resetWorkout = () => {
		setWorkoutID(0);
		setWorkoutDate("");
		setWorkoutTitle("");
		setWorkoutExercises([]);
	}

	const resetOrigWorkout = () => {
		setOrigWorkoutDate("");
		setOrigWorkoutTitle("");
		setOrigWorkoutExercises([]);
	}

	const closeNewWorkout = () => {
		resetWorkout();
		setNewWorkout(false);
	}

	const openNewWorkout = () => {
		setWorkoutDate(Date());
		setNewWorkout(true);
	}

	const newWorkoutSubmit = () => {
		closeNewWorkout();
		let workout = {
			date: workoutDate,
			title: workoutTitle,
		};
		NewWorkout(workout).catch((err) => {
			setError(err);
		});
		reload();
	};

	const closeWorkoutPage = () => {
		resetWorkout();
		setWorkoutWithExercises({});
		setWorkoutPage(false);
		reload();
	};

	const openWorkoutPage = (index) => {
		getWorkoutWithExercises(workouts[index].id);
		setWorkoutPage(true);
	};

	const cancelWorkoutPageEdit = () => {
		resetWorkout();
		resetOrigWorkout();

		let origWorkout = workoutWithExercises;
		origWorkout.date = origWorkoutDate;
		origWorkout.title = origWorkoutTitle;
		origWorkout.exercises = origWorkoutExercises;

		setWorkoutWithExercises(origWorkout);
		setWorkoutPage(true);
		setWorkoutPageEdit(false);
	};

	const editWorkoutPage = () => {
		setWorkoutID(workoutWithExercises.id);
		setWorkoutDate(workoutWithExercises.date);
		setOrigWorkoutDate(workoutWithExercises.date);
		setWorkoutTitle(workoutWithExercises.title);
		setOrigWorkoutTitle(workoutWithExercises.title);
		setWorkoutExercises(workoutWithExercises.exercises);
		setOrigWorkoutExercises(workoutWithExercises.exercises);
		setWorkoutPage(false);
		setWorkoutPageEdit(true);
	};

	const saveWorkoutPage = () => {
		let workout = {
			id: workoutID,
			date: workoutDate,
			title: workoutTitle,
			exercises: workoutExercises,
		};
		updateWorkoutAddExercises(workout);
		resetWorkout();
		resetOrigWorkout();
		setWorkoutPageEdit(false);
		setWorkoutPage(true);
	};

	const workoutDateChange = (event) => {
		let oldDate = workoutWithExercises.date;
		let newDate = event.target.value;
		let datetime = newDate + oldDate.substring(10);

		let newWorkout = workoutWithExercises;
		newWorkout.date = datetime;

		setWorkoutDate(datetime);
		setWorkoutWithExercises(newWorkout);
	};

	const workoutTimeChange = (event) => {
		let oldDate = workoutWithExercises.date;
		let newTime = event.target.value;
		let date = oldDate.substring(0,11);
		let zone = oldDate.substring(16);
		let datetime = date + newTime + zone;

		let newWorkout = workoutWithExercises;
		newWorkout.date = datetime;

		setWorkoutDate(datetime);
		setWorkoutWithExercises(newWorkout);
	};

	const workoutTitleChange = (event) => {
		let newTitle = event.target.value;

		let newWorkout = workoutWithExercises;
		newWorkout.title = newTitle;

		setWorkoutTitle(newTitle);
		setWorkoutWithExercises(newWorkout);
	};

	const workoutExerciseAdd = (newExercise) => {
		let newRecord = {
			exercise: newExercise,
			result: {workout_id: workoutID, exercise_id: newExercise.id, calories: null, distance: null, reps: null, time: null, weight: null},
		};
		let newExercises = [...workoutWithExercises.exercises, newRecord];

		let newWorkout = workoutWithExercises;
		newWorkout.exercises = newExercises;

		setWorkoutExercises(newExercises);
		setWorkoutWithExercises(newWorkout);
	}

	const workoutExerciseChange = (index, type, value) => {
		let updateWE = workoutWithExercises;
		updateWE.exercises[index].result[type] = value;
		setWorkoutWithExercises(updateWE);
		setOnReloadWorkout(!onReloadWorkout);
	}

	const workoutSubmit = () => {
		setError("Submitting workout with exercises");
		UpdateWorkoutWithExercises(workoutWithExercises).then(() => {
			setError("");
		}).catch((err) => {
			setError(err);
		});
	}

	if (error !== "") {
		return (
			<>
				<h1>Error: {error}</h1>
			</>
		); 
	}

	if (workoutPageEdit) {
		let date = workoutWithExercises.date.substring(0, 10);
		let time = workoutWithExercises.date.substring(11, 16);
		return(
			<>
				<MenuBar bottom={true} leftIcon={cancel} leftClick={cancelWorkoutPageEdit} title={"Workout"} rightIcon={save} rightClick={saveWorkoutPage} />
				<Workout workout={workoutWithExercises} edit={true} date={date} time={time} titleChange={workoutTitleChange} dateChange={workoutDateChange} exerciseAdd={workoutExerciseAdd} workoutExerciseChange={workoutExerciseChange} />
				<Navigation parent={NavHome} reset={closeWorkoutPage} />
			</>
		);
	}

	if (workoutPage) {
		return(
			<>
				<MenuBar bottom={true} leftIcon={back} leftClick={closeWorkoutPage} title={"Workout"} rightIcon={pencil} rightClick={editWorkoutPage} />
				<Workout workout={workoutWithExercises} workoutExerciseChange={workoutExerciseChange} submitWorkoutHandler={workoutSubmit} edit={false}/>
				<Navigation parent={NavHome} reset={closeWorkoutPage} />
			</>
		);
	}

	return (
		<div className="Workouts">
			<MenuBar title={"Workouts"} leftIcon={blank} rightIcon={pluscircle} rightClick={openNewWorkout}/>
			<ListGroup variant="flush" className="MenuList">
				{workouts.map((workout, index) => (
					<ListGroup.Item key={index} value={index} action onClick={(event) => {openWorkoutPage(event.target.getAttribute('value'))}}>
						<b value={index}>{workout.title}</b><br/>
					{workout.date.substring(0, 16) + workout.date.substring(22)}
				</ListGroup.Item>
				))}
			</ListGroup>
			<Navigation parent={NavHome}/>
			<NewWorkoutModal header={"New Workout"} show={newWorkout} onHide={closeNewWorkout} workoutTitle={workoutTitle} workoutTitleChangeHandler={setWorkoutTitle} workoutDate={workoutDate} submitWorkoutHandler={newWorkoutSubmit}/>
		</div>
	);
}

export default Workouts;
