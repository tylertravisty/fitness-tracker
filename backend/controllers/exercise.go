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

func (ec *ExerciseController) Get(page int) ([]models.Exercise, error) {
	return ec.es.ByLimitOffset(10, 10*page)
}

func (ec *ExerciseController) GetAll() ([]models.Exercise, error) {
	return ec.es.All()
}

func (ec *ExerciseController) New(exercise models.Exercise) error {
	return ec.es.Create(&exercise)
}

func (ec *ExerciseController) Update(exercise models.Exercise) error {
	return ec.es.Update(&exercise)
}
