import {
	ExerciseGet,
	ExerciseNew,
	ExerciseUpdate
} from '../../../wailsjs/go/main/App';

function GetExercises(page) {
	return ExerciseGet(page);
}

function NewExercise(exercise) {
	return ExerciseNew(exercise);
}

function UpdateExercise(exercise) {
	return ExerciseUpdate(exercise);
}

export {
	GetExercises,
	NewExercise,
	UpdateExercise,
};
