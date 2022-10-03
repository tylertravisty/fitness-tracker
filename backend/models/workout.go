package models

import (
	"database/sql"
	"fmt"
	"time"
)

const (
	WorkoutTitleMaxLength = 50
	// TODO: remove seconds from format and test if it still works
	//WorkoutDateFormat = "2006-01-02 15:04:05 -0700 MST"
	WorkoutDateFormat = "2006-01-02 15:04 -0700 MST"
	workoutTable      = "workout"
)

type Record struct {
	Exercise *Exercise        `json:"exercise"`
	Result   *WorkoutExercise `json:"result"`
}

type sqlRecord struct {
	se  sqlExercise
	swe sqlWorkoutExercise
}

func (sr sqlRecord) toRecord() *Record {
	var r Record

	r.Exercise = sr.se.toExercise()
	r.Result = sr.swe.toWorkoutExercise()

	return &r
}

type Workout struct {
	ID          int64    `json:"id"`
	Date        string   `json:"date"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
	Exercises   []Record `json:"exercises"`
}

type sqlWorkout struct {
	id          sql.NullInt64
	date        sql.NullString
	title       sql.NullString
	description sql.NullString
	exercises   []sqlRecord
}

func (sw sqlWorkout) toWorkout() *Workout {
	var w Workout
	w.ID = toInt64(sw.id)
	w.Date = toLocalDateString(sw.date, WorkoutDateFormat)
	w.Title = toString(sw.title)
	w.Description = toString(sw.description)
	w.Exercises = []Record{}
	for _, se := range sw.exercises {
		w.Exercises = append(w.Exercises, *se.toRecord())
	}

	return &w
}

func NewWorkoutService(db *sql.DB) WorkoutService {
	return &workoutService{
		Database: db,
	}
}

type WorkoutService interface {
	AutoMigrate() error
	ByLimitOffset(limit int, offset int) ([]Workout, error)
	ByID(id int64) (*Workout, error)
	ByIDWithExercises(id int64) (*Workout, error)
	Create(w *Workout) error
	Delete(w *Workout) error
	Update(w *Workout) error
}

var _ WorkoutService = &workoutService{}

type workoutService struct {
	Database *sql.DB
}

func (ws *workoutService) AutoMigrate() error {
	createWorkoutQ := fmt.Sprintf(`
		CREATE TABLE IF NOT EXISTS "%s" (
			id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
			date TEXT UNIQUE,
			title TEXT,
			description TEXT
		)
	`, workoutTable)
	_, err := ws.Database.Exec(createWorkoutQ)
	if err != nil {
		return fmt.Errorf("models: error while creating \"%s\" table: %v", workoutTable, err)
	}

	return nil
}

func (ws *workoutService) ByLimitOffset(limit int, offset int) ([]Workout, error) {
	if limit < 0 {
		return nil, fmt.Errorf("models: limit cannot be negative")
	}
	if offset < 0 {
		return nil, fmt.Errorf("models: offset cannot be negative")
	}

	workoutQ := fmt.Sprintf(`
		SELECT id, date, title, description
		FROM "%s"
		ORDER BY date DESC 
		LIMIT %d OFFSET %d
	`, workoutTable, limit, offset)

	rows, err := ws.Database.Query(workoutQ)
	if err != nil {
		return nil, fmt.Errorf("models: error while querying \"%s\" by limit offset: %v", workoutTable, err)
	}
	defer rows.Close()

	workouts := []Workout{}
	for rows.Next() {
		var sw sqlWorkout
		err = rows.Scan(&sw.id, &sw.date, &sw.title, &sw.description)
		if err != nil {
			return nil, fmt.Errorf("models: error while scanning row from \"%s\": %v", workoutTable, err)
		}

		workouts = append(workouts, *sw.toWorkout())
	}
	err = rows.Err()
	if err != nil && err != sql.ErrNoRows {
		return nil, fmt.Errorf("models: error while iterating over rows from \"%s\": %v", workoutTable, err)
	}

	return workouts, nil
}

func (ws *workoutService) ByID(id int64) (*Workout, error) {
	w := &Workout{ID: id}
	err := runWorkoutValFuncs(
		w,
		workoutIDMinimum,
	)
	if err != nil {
		return nil, fmt.Errorf("models: %w", err)
	}

	workoutQ := fmt.Sprintf(`
		SELECT id, date, title, description
		FROM "%s"
		WHERE id=?
	`, workoutTable)

	var sw sqlWorkout
	row := ws.Database.QueryRow(workoutQ, w.ID)
	err = row.Scan(&sw.id, &sw.date, &sw.title, &sw.description)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("models: error while querying \"%s\" by ID: %v", workoutTable, err)
	}

	return sw.toWorkout(), nil
}

func (ws *workoutService) ByIDWithExercises(id int64) (*Workout, error) {
	w := &Workout{ID: id}
	err := runWorkoutValFuncs(
		w,
		workoutIDMinimum,
	)
	if err != nil {
		return nil, fmt.Errorf("models: %w", err)
	}

	workoutQ := fmt.Sprintf(`
		SELECT w.id, w.date, w.title, w.description, e.id, e.name, e.calories, e.distance, e.reps, e.time, e.weight, we.id, we.workout_id, we.exercise_id, we.calories, we.distance, we.reps, we.time, we.weight
		FROM "%s" w
		LEFT JOIN "%s" we ON w.id=we.workout_id
		LEFT JOIN "%s" e on e.id=we.exercise_id
		WHERE w.id=?
	`, workoutTable, workoutExerciseTable, exerciseTable)

	rows, err := ws.Database.Query(workoutQ, id)
	if err != nil {
		return nil, fmt.Errorf("models: error while querying \"%s\" with \"%s\" by ID: %v", workoutTable, exerciseTable, err)
	}
	defer rows.Close()

	var sw sqlWorkout
	exercises := []sqlRecord{}
	for rows.Next() {
		var se sqlExercise
		var swe sqlWorkoutExercise
		var sr sqlRecord
		err = rows.Scan(&sw.id, &sw.date, &sw.title, &sw.description, &se.id, &se.name, &se.calories, &se.distance, &se.reps, &se.time, &se.weight, &swe.id, &swe.workoutID, &swe.exerciseID, &swe.calories, &swe.distance, &swe.reps, &swe.time, &swe.weight)
		if err != nil {
			return nil, fmt.Errorf("models: error while scanning row from \"%s\" with \"%s\": %v", workoutTable, exerciseTable, err)
		}

		if se.id.Valid {
			sr.se = se
			sr.swe = swe
			exercises = append(exercises, sr)
		}
	}
	err = rows.Err()
	if err != nil && err != sql.ErrNoRows {
		return nil, fmt.Errorf("models: error while iterating over rows from \"%s\" with \"%s\": %v", workoutTable, exerciseTable, err)
	}

	sw.exercises = exercises
	return sw.toWorkout(), nil
}

func (ws *workoutService) Create(w *Workout) error {
	err := runWorkoutValFuncs(
		w,
		workoutRequireDateFormat,
		workoutRequireTitle,
	)
	if err != nil {
		return fmt.Errorf("models: %w", err)
	}

	insertWorkoutQ := fmt.Sprintf(`
		INSERT INTO "%s" (date, title, description)
		VALUES (?, ?, ?)
	`, workoutTable)

	_, err = ws.Database.Exec(insertWorkoutQ, w.Date, w.Title, w.Description)
	if err != nil {
		return fmt.Errorf("models: error while inserting %s: %v", workoutTable, err)
	}

	return nil
}

func (ws *workoutService) Delete(w *Workout) error {
	err := runWorkoutValFuncs(
		w,
		workoutIDMinimum,
	)
	if err != nil {
		return fmt.Errorf("models: %w", err)
	}

	deleteWorkoutQ := fmt.Sprintf(`
		DELETE FROM "%s"
		WHERE id=?
	`, workoutTable)

	_, err = ws.Database.Exec(deleteWorkoutQ, w.ID)
	if err != nil {
		return fmt.Errorf("models: error deleting %s: %v", workoutTable, err)
	}

	return nil
}

func (ws *workoutService) Update(w *Workout) error {
	err := runWorkoutValFuncs(
		w,
		workoutIDMinimum,
		workoutRequireDateFormat,
		workoutRequireTitle,
	)
	if err != nil {
		return fmt.Errorf("models: %w", err)
	}

	updateWorkoutQ := fmt.Sprintf(`
		UPDATE "%s"
		SET date=?, title=?
		WHERE id=?
	`, workoutTable)

	_, err = ws.Database.Exec(updateWorkoutQ, w.Date, w.Title, w.ID)
	if err != nil {
		return fmt.Errorf("models: error updating %s: %v", workoutTable, err)
	}

	return nil
}

type workoutValFunc func(*Workout) error

func runWorkoutValFuncs(w *Workout, fns ...workoutValFunc) error {
	if w == nil {
		return fmt.Errorf("workout is nil")
	}

	for _, fn := range fns {
		err := fn(w)
		if err != nil {
			return err
		}
	}

	return nil
}

func workoutIDMinimum(w *Workout) error {
	if w.ID < 1 {
		return ErrWorkoutInvalidID
	}

	return nil
}

func workoutRequireDateFormat(w *Workout) error {
	_, err := time.Parse(WorkoutDateFormat, w.Date)
	if err != nil {
		return fmt.Errorf("error parsing workout date: %v", err)
	}

	return nil
}

func workoutRequireTitle(w *Workout) error {
	if w.Title == "" {
		return ErrWorkoutInvalidTitle
	}

	return nil
}

func workoutTitleMaxLength(w *Workout) error {
	if len(w.Title) > WorkoutTitleMaxLength {
		return ErrWorkoutInvalidTitle
	}

	return nil
}
