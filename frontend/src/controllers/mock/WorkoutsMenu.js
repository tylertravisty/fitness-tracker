let workouts = [
	{id: 1, date: "2022-05-07 11:05 -0400 EDT", title: "Strength"},
	{id: 2, date: "2022-05-08 11:05 -0400 EDT", title: "Conditioning"},
	{id: 3, date: "2022-05-09 11:05 -0400 EDT", title: "Strength"},
	{id: 4, date: "2022-05-10 11:05 -0400 EDT", title: "Conditioning"},
	{id: 5, date: "2022-05-11 11:05 -0400 EDT", title: "Strength"},
	{id: 6, date: "2022-05-12 11:05 -0400 EDT", title: "Conditioning"},
	{id: 7, date: "2022-05-13 11:05 -0400 EDT", title: "Strength"},
	{id: 8, date: "2022-05-14 11:05 -0400 EDT", title: "Cardio"},
	{id: 9, date: "2022-05-15 11:05 -0400 EDT", title: "Strength"},
	{id: 10, date: "2022-05-16 11:05 -0400 EDT", title: "Mixed Cardio"},
	{id: 11, date: "2022-05-17 11:05 -0400 EDT", title: "Strength"},
	{id: 12, date: "2022-05-18 11:05 -0400 EDT", title: "Run"}
];

let exercises = [
	{id: 1, name: "exercise 1", calories: true, distance: false, reps: false, time: true, weight: false},
	{id: 2, name: "exercise 2", calories: false, distance: false, reps: true, time: false, weight: true},
	{id: 3, name: "exercise 3", calories: false, distance: true, reps: false, time: true, weight: false},
	{id: 4, name: "exercise 4", calories: true, distance: false, reps: false, time: false, weight: false},
	{id: 5, name: "exercise 5", calories: false, distance: true, reps: false, time: false, weight: false},
	{id: 6, name: "exercise 6", calories: false, distance: false, reps: true, time: false, weight: false},
	{id: 7, name: "exercise 7", calories: false, distance: false, reps: false, time: true, weight: false},
	{id: 8, name: "exercise 8", calories: false, distance: false, reps: false, time: false, weight: true},
	{id: 9, name: "exercise 9", calories: false, distance: false, reps: true, time: true, weight: false},
	{id: 10, name: "exercise 10", calories: true, distance: true, reps: true, time: true, weight: true},
	{id: 11, name: "exercise 11", calories: true, distance: true, reps: true, time: true, weight: true},
];

let workoutExercises = [
	{id: 1, workout_id: 1, exercise_id: 1, calories: null, distance: null, reps: null, time: null, weight: null},
	{id: 2, workout_id: 1, exercise_id: 2, calories: null, distance: null, reps: null, time: null, weight: null},
	{id: 3, workout_id: 1, exercise_id: 3, calories: null, distance: null, reps: null, time: null, weight: null},
	{id: 4, workout_id: 3, exercise_id: 10, calories: 100, distance: null, reps: null, time: null, weight: null},
	{id: 5, workout_id: 5, exercise_id: 5, calories: null, distance: null, reps: null, time: null, weight: null},
	{id: 6, workout_id: 3, exercise_id: 3, calories: 55, distance: null, reps: null, time: null, weight: null},
	{id: 7, workout_id: 3, exercise_id: 10, calories: 360, distance: null, reps: null, time: null, weight: null},
];

function GetWorkouts(page) {
	return new Promise((resolve, reject) => {
		resolve(workouts.slice(5*page, 5*page+5));
	});
}

function GetWorkoutWithExercises(id) {
	return new Promise((resolve, reject) => {
		let found = false;
		var i;
		for(i=0; i < workouts.length; i++) {
			if (id === workouts[i].id) {
				found = true;
				break;
			}
		}
		if (!found) {
			reject("Workout does not exists");
		}

		let records = [];
		workoutExercises.map((we) => {
			if (we.workout_id === id) {
				let record = {
					exercise: exercises[we.exercise_id],
					result: we,
				}
				records = [...records, record];
			}
		});

		resolve({id: workouts[i].id, date: workouts[i].date, title: workouts[i].title, exercises: records});
	});
}

function prefixZero(number) {
	let s = "" + number
	if (number < 10) {
		s = "0" + s
	}

	return s
}


// "2006-01-02 15:04:05 -0700 MST"
function NewWorkout(workout) {
	let date = new Date();
	let month = date.getMonth() + 1
	let monthS = "" + month
	if (month < 10) {
		monthS = "0" + monthS
	}
	let dateS = date.getFullYear() + '-' + prefixZero(date.getMonth() + 1) + '-' + prefixZero(date.getDate());
	//dateS = dateS + " " + prefixZero(date.getHours()) + ":" + prefixZero(date.getMinutes()) + ":" + prefixZero(date.getSeconds());
	dateS = dateS + " " + prefixZero(date.getHours()) + ":" + prefixZero(date.getMinutes());
	dateS = dateS + " " + "-0400 EDT"
	let newWorkout ={
		id: workouts.length+1,
		date: dateS,
		title: workout.title,
	};
	return new Promise((resolve, reject) => {
		workouts.push(newWorkout);
		resolve();
	});
}

function UpdateWorkout(workout) {
	return new Promise((resolve, reject) => {
		let found = false;
		var i;
		for(i=0; i < workouts.length; i++) {
			if (workout.id === workouts[i].id) {
				found = true;
				break;
			}
		}
		if (!found) {
			reject("Workout does not exists");
		}

		workouts[i].date = workout.date;
		workouts[i].title = workout.title;
		resolve();
	});
}


export {
	GetWorkouts,
	GetWorkoutWithExercises,
	NewWorkout,
	UpdateWorkout,
};
