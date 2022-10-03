import {
	WorkoutDelete,
	WorkoutEdit,
	WorkoutGet,
	WorkoutGetWithExercises,
	WorkoutNew,
	WorkoutUpdate,
	WorkoutUpdateWithExercises
} from '../../../wailsjs/go/main/App';

function DeleteWorkout(workout) {
	return WorkoutDelete(workout);
}

function EditWorkout(workout) {
	return WorkoutEdit(workout);
}

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

function UpdateWorkoutWithExercises(workout) {
	return WorkoutUpdateWithExercises(workout);
}

export {
	DeleteWorkout,
	EditWorkout,
	GetWorkouts,
	GetWorkoutWithExercises,
	NewWorkout,
	UpdateWorkout,
	UpdateWorkoutWithExercises,
};
