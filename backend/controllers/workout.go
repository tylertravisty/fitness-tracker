package controllers

import (
	"errors"
	"fmt"
	"time"

	"github.com/tylertravisty/fitness-tracker/backend/models"
)

func NewWorkoutController(c *Controller, ws models.WorkoutService, wes models.WorkoutExerciseService) *WorkoutController {
	return &WorkoutController{
		c:   c,
		ws:  ws,
		wes: wes,
	}
}

type WorkoutController struct {
	c   *Controller
	ws  models.WorkoutService
	wes models.WorkoutExerciseService
}

func (wc *WorkoutController) Get(page int) ([]models.Workout, error) {
	return wc.ws.ByLimitOffset(10, 10*page)
}

func (wc *WorkoutController) GetWithExercises(id int64) (*models.Workout, error) {
	return wc.ws.ByIDWithExercises(id)
}

func (wc *WorkoutController) New(workout models.Workout) error {
	loc, err := time.LoadLocation("UTC")
	if err != nil {
		return wc.c.userError(fmt.Errorf("error loading time location: %v", err), errors.New("Error loading time location"))
	}
	date := time.Now().In(loc).Format(models.WorkoutDateFormat)
	err = wc.ws.Create(&models.Workout{Date: date, Title: workout.Title})
	if err != nil {
		return wc.c.userError(err, ErrWorkoutCreate)
	}

	return nil
}

func (wc *WorkoutController) AddExercise(w *models.Workout, exr *models.Exercise) error {
	err := wc.wes.Create(&models.WorkoutExercise{WorkoutID: w.ID, ExerciseID: exr.ID})
	if err != nil {
		return wc.c.userError(err, ErrWorkoutAddExercise)
	}

	return nil
}

func (wc *WorkoutController) Update(workout models.Workout) error {
	loc, err := time.LoadLocation("UTC")
	if err != nil {
		return wc.c.userError(fmt.Errorf("error loading time location: %v", err), errors.New("Error loading time location"))
	}

	date, err := time.Parse(models.WorkoutDateFormat, workout.Date)
	if err != nil {
		return wc.c.userError(fmt.Errorf("error parsing workout date: %v", err), errors.New("Error parsing workout date"))
	}

	dateUTC := date.In(loc).Format(models.WorkoutDateFormat)

	err = wc.ws.Update(&models.Workout{ID: workout.ID, Date: dateUTC, Title: workout.Title})
	if err != nil {
		return wc.c.userError(err, ErrWorkoutUpdate)
	}

	return nil
}
