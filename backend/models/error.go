package models

const (
	ErrExerciseInvalidID   ValidatorError = "invalid exercise ID"
	ErrExerciseInvalidName ValidatorError = "invalid exercise name"
	ErrWorkoutInvalidID    ValidatorError = "invalid workout ID"
	ErrWorkoutInvalidTitle ValidatorError = "invalid workout title"
)

type ValidatorError string

func (ve ValidatorError) Error() string {
	return string(ve)
}
