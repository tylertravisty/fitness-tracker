package controllers

import "github.com/tylertravisty/fitness-tracker/backend/models"

func NewExerciseController(c *Controller, es models.ExerciseService) *ExerciseController {
	return &ExerciseController{
		c:  c,
		es: es,
	}
}

type ExerciseController struct {
	c  *Controller
	es models.ExerciseService
}

func (ec *ExerciseController) Delete(exercise models.Exercise) error {
	err := ec.es.Delete(&exercise)
	userErr := ec.c.userError("error deleting exercise", err, ErrExerciseDelete)

	return userErr
}

func (ec *ExerciseController) Get(page int) ([]models.Exercise, error) {
	exercises, err := ec.es.ByLimitOffset(10, 10*page)
	userErr := ec.c.userError("error querying exercises by limit offset", err, ErrExercisesQuery)

	return exercises, userErr
}

func (ec *ExerciseController) GetAll() ([]models.Exercise, error) {
	exercises, err := ec.es.All()
	userErr := ec.c.userError("error querying all exercises", err, ErrExercisesQuery)

	return exercises, userErr
}

func (ec *ExerciseController) New(exercise models.Exercise) error {
	err := ec.es.Create(&exercise)
	userErr := ec.c.userError("error creating exercise", err, ErrExerciseCreate)

	return userErr
}

func (ec *ExerciseController) Update(exercise models.Exercise) error {
	err := ec.es.Update(&exercise)
	userErr := ec.c.userError("error updating exercise", err, ErrExerciseUpdate)

	return userErr
}
