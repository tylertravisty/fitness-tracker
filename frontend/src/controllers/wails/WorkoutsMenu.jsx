import {
	WorkoutGet,
	WorkoutGetWithExercises,
	WorkoutNew,
	WorkoutUpdate
} from '../../../wailsjs/go/main/App';

function GetWorkouts(page) {
	return WorkoutGet(page);
}

function GetWorkoutWithExercises(id) {
	return WorkoutGetWithExercises(id);
}

function NewWorkout(workout) {
	return WorkoutNew(workout);
}

function UpdateWorkout(workout) {
	return WorkoutUpdate(workout);
}

export {
	GetWorkouts,
	GetWorkoutWithExercises,
	NewWorkout,
	UpdateWorkout,
};
