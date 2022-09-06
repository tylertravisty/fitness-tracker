package models

const (
	ErrExerciseInvalidID   UserError = "invalid exercise ID"
	ErrExerciseInvalidName UserError = "invalid exercise name"
	ErrWorkoutInvalidID    UserError = "invalid workout ID"
	ErrWorkoutInvalidTitle UserError = "invalid workout title"
)

type UserError string

func (ue UserError) Error() string {
	return string(ue)
}
