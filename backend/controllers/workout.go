package controllers

import (
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
	workouts, err := wc.ws.ByLimitOffset(10, 10*page)
	userErr := wc.c.userError("error querying workouts by limit offset", err, ErrWorkoutsQuery)

	return workouts, userErr
}

func (wc *WorkoutController) GetWithExercises(id int64) (*models.Workout, error) {
	workout, err := wc.ws.ByIDWithExercises(id)
	userErr := wc.c.userError("error querying workout with exercises by ID", err, ErrWorkoutQuery)

	return workout, userErr
}

func (wc *WorkoutController) New(workout models.Workout) error {
	loc, err := time.LoadLocation("UTC")
	if err != nil {
		return wc.c.userError("error loading time location", err, ErrTimeLocation)
	}
	date := time.Now().In(loc).Format(models.WorkoutDateFormat)
	err = wc.ws.Create(&models.Workout{Date: date, Title: workout.Title})
	if err != nil {
		return wc.c.userError("error creating workout", err, ErrWorkoutCreate)
	}

	return nil
}

func (wc *WorkoutController) AddExercise(w *models.Workout, exr *models.Exercise) error {
	err := wc.wes.Create(&models.WorkoutExercise{WorkoutID: w.ID, ExerciseID: exr.ID})
	userErr := wc.c.userError("error creating workoutexercise", err, ErrWorkoutAddExercise)

	return userErr
}

func (wc *WorkoutController) Edit(workout models.Workout) error {
	err := wc.Update(workout)
	if err != nil {
		return err
	}

	for _, exercise := range workout.Exercises {
		err = wc.wes.Delete(exercise.Result)
		if err != nil {
			return wc.c.userError("error deleting workoutexercise", err, ErrWorkoutExerciseUpdate)
		}
	}

	for _, exercise := range workout.Exercises {
		err = wc.wes.Create(exercise.Result)
		if err != nil {
			return wc.c.userError("error creating workoutexercise", err, ErrWorkoutAddExercise)
		}
		err = wc.wes.Update(exercise.Result)
		if err != nil {
			return wc.c.userError("error updating workoutexercise", err, ErrWorkoutExerciseUpdate)
		}
	}

	return nil
}

func (wc *WorkoutController) Update(workout models.Workout) error {
	loc, err := time.LoadLocation("UTC")
	if err != nil {
		return wc.c.userError("error loading time location", err, ErrTimeLocation)
	}

	date, err := time.Parse(models.WorkoutDateFormat, workout.Date)
	if err != nil {
		return wc.c.userError("error parsing workout date", err, ErrWorkoutParseDate)
	}

	dateUTC := date.In(loc).Format(models.WorkoutDateFormat)

	err = wc.ws.Update(&models.Workout{ID: workout.ID, Date: dateUTC, Title: workout.Title})
	if err != nil {
		return wc.c.userError("error updating workout", err, ErrWorkoutUpdate)
	}

	// TODO: implement all of the checking to add/remove exercises
	// get existing exercises from database, check against list passed in from frontend
	// if missing, delete; if extra, add.

	return nil
}

func (wc *WorkoutController) UpdateWithExercises(workout models.Workout) error {
	err := wc.Update(workout)
	if err != nil {
		return err
	}

	if workout.Exercises == nil {
		return nil
	}

	for _, exercise := range workout.Exercises {
		err = wc.wes.Update(exercise.Result)
		if err != nil {
			return wc.c.userError("error updating workoutexercise", err, ErrWorkoutExerciseUpdate)
		}
	}

	return nil
}
