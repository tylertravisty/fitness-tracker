package models

import (
	"database/sql"
	"fmt"
)

const (
	workoutExerciseTable = "workout_exercise"
)

type WorkoutExercise struct {
	ID         int64    `json:"id"`
	WorkoutID  int64    `json:"workout_id"`
	ExerciseID int64    `json:"exercise_id"`
	Calories   *int64   `json:"calories"`
	Distance   *float64 `json:"distance"`
	Reps       *int64   `json:"reps"`
	Time       *int64   `json:"time"`
	Weight     *int64   `json:"weight"`
}

type sqlWorkoutExercise struct {
	id         sql.NullInt64
	workoutID  sql.NullInt64
	exerciseID sql.NullInt64
	calories   sql.NullInt64
	distance   sql.NullFloat64
	reps       sql.NullInt64
	time       sql.NullInt64
	weight     sql.NullInt64
}

func (swe sqlWorkoutExercise) toWorkoutExercise() *WorkoutExercise {
	var we WorkoutExercise
	we.ID = toInt64(swe.id)
	we.WorkoutID = toInt64(swe.workoutID)
	we.ExerciseID = toInt64(swe.exerciseID)
	//we.Calories = toInt64(swe.calories)
	//we.Distance = toFloat64(swe.distance)
	//we.Reps = toInt64(swe.reps)
	//we.Time = toInt64(swe.time)
	//we.Weight = toInt64(swe.weight)
	if swe.calories.Valid {
		we.Calories = &swe.calories.Int64
	}
	if swe.distance.Valid {
		we.Distance = &swe.distance.Float64
	}
	if swe.reps.Valid {
		we.Reps = &swe.reps.Int64
	}
	if swe.time.Valid {
		we.Time = &swe.time.Int64
	}
	if swe.weight.Valid {
		we.Weight = &swe.weight.Int64
	}

	return &we
}

func NewWorkoutExerciseService(db *sql.DB) WorkoutExerciseService {
	return &workoutExerciseService{
		Database: db,
	}
}

type WorkoutExerciseService interface {
	AutoMigrate() error
	Create(we *WorkoutExercise) error
	Delete(we *WorkoutExercise) error
	Update(we *WorkoutExercise) error
}

var _ WorkoutExerciseService = &workoutExerciseService{}

type workoutExerciseService struct {
	Database *sql.DB
}

func (wes *workoutExerciseService) AutoMigrate() error {
	createWorkoutExerciseQ := fmt.Sprintf(`
		CREATE TABLE IF NOT EXISTS "%s" (
			id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
			workout_id INTEGER NOT NULL,
			exercise_id INTEGER NOT NULL,
			calories INTEGER,
			distance DECIMAL,
			reps INTEGER,
			time INTEGER,
			weight INTEGER,
			FOREIGN KEY (workout_id) REFERENCES "%s" (id),
			FOREIGN KEY (exercise_id) REFERENCES "%s" (id)
		)
	`, workoutExerciseTable, workoutTable, exerciseTable)
	_, err := wes.Database.Exec(createWorkoutExerciseQ)
	if err != nil {
		return fmt.Errorf("models: error while creating \"%s\" table: %v", workoutExerciseTable, err)
	}
	return nil
}

func (wes *workoutExerciseService) Create(we *WorkoutExercise) error {
	err := runWorkoutExerciseValFuncs(
		we,
		workoutExerciseNotNil,
		workoutExerciseWorkoutIDMinimum,
		workoutExerciseExerciseIDMinimum,
	)
	if err != nil {
		return fmt.Errorf("models: %w", err)
	}

	insertWorkoutExerciseQ := fmt.Sprintf(`
		INSERT INTO "%s" (workout_id, exercise_id)
		VALUES (?, ?)
		RETURNING id
	`, workoutExerciseTable)

	//_, err = wes.Database.Exec(insertWorkoutExerciseQ, we.WorkoutID, we.ExerciseID)
	//if err != nil {
	//	return fmt.Errorf("models: error while inserting %s: %v", workoutExerciseTable, err)
	//}

	var id int64
	row := wes.Database.QueryRow(insertWorkoutExerciseQ, we.WorkoutID, we.ExerciseID)
	err = row.Scan(&id)
	if err != nil {
		return fmt.Errorf("models: error while inserting %s: %v", workoutExerciseTable, err)
	}

	we.ID = id

	return nil
}

func (wes *workoutExerciseService) Delete(we *WorkoutExercise) error {
	err := runWorkoutExerciseValFuncs(
		we,
		workoutExerciseNotNil,
	)
	if err != nil {
		return fmt.Errorf("models: %w", err)
	}

	deleteWorkoutExerciseQ := fmt.Sprintf(`
		DELETE FROM "%s"
		WHERE id=?
	`, workoutExerciseTable)

	_, err = wes.Database.Exec(deleteWorkoutExerciseQ, we.ID)
	if err != nil {
		return fmt.Errorf("models: error updating %s: %v", workoutExerciseTable, err)
	}

	return nil
}

func (wes *workoutExerciseService) Update(we *WorkoutExercise) error {
	err := runWorkoutExerciseValFuncs(
		we,
		workoutExerciseNotNil,
	)
	if err != nil {
		return fmt.Errorf("models: %w", err)
	}

	updateWorkoutExerciseQ := fmt.Sprintf(`
		UPDATE "%s"
		SET calories=?, distance=?, reps=?, time=?, weight=?
		WHERE id=?
	`, workoutExerciseTable)

	_, err = wes.Database.Exec(updateWorkoutExerciseQ, we.Calories, we.Distance, we.Reps, we.Time, we.Weight, we.ID)
	if err != nil {
		return fmt.Errorf("models: error updating %s: %v", workoutExerciseTable, err)
	}

	return nil
}

type workoutExerciseValFunc func(*WorkoutExercise) error

func runWorkoutExerciseValFuncs(we *WorkoutExercise, fns ...workoutExerciseValFunc) error {
	for _, fn := range fns {
		err := fn(we)
		if err != nil {
			return err
		}
	}

	return nil
}

func workoutExerciseNotNil(we *WorkoutExercise) error {
	if we == nil {
		return fmt.Errorf("workoutexercise is nil")
	}

	return nil
}

func workoutExerciseWorkoutIDMinimum(we *WorkoutExercise) error {
	if we.WorkoutID < 1 {
		return ErrWorkoutInvalidID
	}

	return nil
}

func workoutExerciseExerciseIDMinimum(we *WorkoutExercise) error {
	if we.ExerciseID < 1 {
		return ErrExerciseInvalidID
	}

	return nil
}
