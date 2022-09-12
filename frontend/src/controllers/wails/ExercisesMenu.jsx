import {
	ExerciseGet,
	ExerciseGetAll,
	ExerciseNew,
	ExerciseUpdate
} from '../../../wailsjs/go/main/App';

function GetExercises(page) {
	return ExerciseGet(page);
}

function GetAllExercises() {
	return ExerciseGetAll();
}

function NewExercise(exercise) {
	return ExerciseNew(exercise);
}

function UpdateExercise(exercise) {
	return ExerciseUpdate(exercise);
}

export {
	GetExercises,
	GetAllExercises,
	NewExercise,
	UpdateExercise,
};
