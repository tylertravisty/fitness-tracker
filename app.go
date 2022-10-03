package main

import (
	"context"
	"fmt"
	"os"

	_ "github.com/mattn/go-sqlite3"
	"github.com/tylertravisty/fitness-tracker/backend/controllers"
	"github.com/tylertravisty/fitness-tracker/backend/models"
)

// App struct
type App struct {
	ctx        context.Context
	services   *models.Services
	controller *controllers.Controller
	ExerciseC  *controllers.ExerciseController
	WorkoutC   *controllers.WorkoutController
}

// NewApp creates a new App application struct
func NewApp() *App {
	return &App{}
}

// startup is called at application startup
func (a *App) startup(ctx context.Context) {
	fmt.Println("Startup")

	// Perform your setup here
	a.ctx = ctx

	services, err := models.NewServices(
		models.WithDatabase("./tmp/sqlite/workouttracker.db"),
		models.WithExercise(),
		models.WithWorkout(),
		models.WithWorkoutExercise(),
	)
	if err != nil {
		fmt.Println("error creating new services:", err)
		os.Exit(1)
	}

	err = services.AutoMigrate()
	if err != nil {
		fmt.Println("error auto-migrating:", err)
		os.Exit(1)
	}

	a.services = services
	a.controller = &controllers.Controller{}

	a.ExerciseC = controllers.NewExerciseController(a.controller, a.services.ExerciseS)
	a.WorkoutC = controllers.NewWorkoutController(a.controller, a.services.WorkoutS, a.services.WorkoutExerciseS)

}

// domReady is called after the front-end dom has been loaded
func (a App) domReady(ctx context.Context) {
	fmt.Println("DOM Ready")
	// Add your action here
}

// beforeClose is called when the application is about to quit,
// either by clicking the window close button or calling runtime.Quit.
// Returning true will cause the application to continue, false will continue shutdown as normal.
func (a *App) beforeClose(ctx context.Context) (prevent bool) {
	fmt.Println("Before Close")
	// Add your action here
	return false
}

// shutdown is called at application termination
func (a *App) shutdown(ctx context.Context) {
	fmt.Println("Shutdown")
	// Perform your teardown here
}

func (a *App) Print(i string, s interface{}) {
	fmt.Println(i, ":", s)
}

func (a *App) PrintNum(i int, s interface{}) {
	fmt.Println(i, ":", s)
}

func (a *App) ExerciseDelete(exercise models.Exercise) error {
	return a.ExerciseC.Delete(exercise)
}

func (a *App) ExerciseGetAll() ([]models.Exercise, error) {
	return a.ExerciseC.GetAll()
}

func (a *App) ExerciseGet(page int) ([]models.Exercise, error) {
	return a.ExerciseC.Get(page)
}

func (a *App) ExerciseNew(exercise models.Exercise) error {
	return a.ExerciseC.New(exercise)
}

func (a *App) ExerciseUpdate(exercise models.Exercise) error {
	return a.ExerciseC.Update(exercise)
}

func (a *App) WorkoutAddExercise(workoutID int64, exerciseID int64) error {
	return a.WorkoutC.AddExercise(&models.Workout{ID: workoutID}, &models.Exercise{ID: exerciseID})
}

func (a *App) WorkoutDelete(workout models.Workout) error {
	return a.WorkoutC.Delete(workout)
}

func (a *App) WorkoutEdit(workout models.Workout) error {
	return a.WorkoutC.Edit(workout)
}

func (a *App) WorkoutGet(page int) ([]models.Workout, error) {
	return a.WorkoutC.Get(page)
}

func (a *App) WorkoutGetWithExercises(id int64) (*models.Workout, error) {
	return a.WorkoutC.GetWithExercises(id)
}

func (a *App) WorkoutNew(workout models.Workout) error {
	return a.WorkoutC.New(workout)
}

func (a *App) WorkoutUpdate(workout models.Workout) error {
	return a.WorkoutC.Update(workout)
}

func (a *App) WorkoutUpdateWithExercises(workout models.Workout) error {
	return a.WorkoutC.UpdateWithExercises(workout)
}
