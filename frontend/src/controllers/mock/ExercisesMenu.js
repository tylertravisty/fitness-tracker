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

function GetExercises(page) {
	return new Promise((resolve, reject) => {
		resolve(exercises.slice(5*page, 5*page+5));
	});
}

function NewExercise(exercise) {
	let newExercise = {
		id: exercises.length+1,
		name: exercise.name,
		calories: exercise.calories,
		distance: exercise.distance,
		reps: exercise.reps,
		time: exercise.time,
		weight: exercise.weight,
	}
	return new Promise((resolve, reject) => {
		exercises.push(newExercise);
		resolve();
	});
}

function UpdateExercise(exercise) {
	return new Promise((resolve, reject) => {
		var i;
		for(i=0; i < exercises.length; i++) {
			if (exercise.id === exercises[i].id) {
				exercises[i].name = exercise.name;
				exercises[i].calories = exercise.calories;
				exercises[i].distance = exercise.distance;
				exercises[i].reps = exercise.reps;
				exercises[i].time = exercise.time;
				exercises[i].weight = exercise.weight;
				resolve();
			}
		}
		reject("Exercise does not exists");
	});
}


export {
	GetExercises,
	NewExercise,
	UpdateExercise,
};
