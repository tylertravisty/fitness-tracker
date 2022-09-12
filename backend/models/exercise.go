package models

import (
	"database/sql"
	"fmt"
)

const (
	exerciseTable = "exercise"
)

type Exercise struct {
	ID       int64  `json:"id"`
	Name     string `json:"name"`
	Calories bool   `json:"calories"`
	Distance bool   `json:"distance"`
	Reps     bool   `json:"reps"`
	Time     bool   `json:"time"`
	Weight   bool   `json:"weight"`
}

type sqlExercise struct {
	id       sql.NullInt64
	name     sql.NullString
	calories sql.NullBool
	distance sql.NullBool
	reps     sql.NullBool
	time     sql.NullBool
	weight   sql.NullBool
}

func (se sqlExercise) toExercise() *Exercise {
	var e Exercise
	e.ID = toInt64(se.id)
	e.Name = toString(se.name)
	e.Calories = toBool(se.calories)
	e.Distance = toBool(se.distance)
	e.Reps = toBool(se.reps)
	e.Time = toBool(se.time)
	e.Weight = toBool(se.weight)

	return &e
}

func NewExerciseService(db *sql.DB) ExerciseService {
	return &exerciseService{
		Database: db,
	}
}

type ExerciseService interface {
	All() ([]Exercise, error)
	AutoMigrate() error
	ByLimitOffset(limit int, offset int) ([]Exercise, error)
	ByName(name string) (*Exercise, error)
	Create(exr *Exercise) error
	Delete(exr *Exercise) error
	Update(exr *Exercise) error
}

var _ ExerciseService = &exerciseService{}

type exerciseService struct {
	Database *sql.DB
}

func (es *exerciseService) All() ([]Exercise, error) {
	exerciseQ := fmt.Sprintf(`
		SELECT id, name, calories, distance, reps, time, weight
		FROM "%s"
		ORDER BY name ASC
	`, exerciseTable)

	rows, err := es.Database.Query(exerciseQ)
	if err != nil {
		return nil, fmt.Errorf("models: error while querying \"%s\" for all rows: %v", exerciseTable, err)
	}
	defer rows.Close()

	exercises := []Exercise{}
	for rows.Next() {
		var se sqlExercise
		err = rows.Scan(&se.id, &se.name, &se.calories, &se.distance, &se.reps, &se.time, &se.weight)
		if err != nil {
			return nil, fmt.Errorf("models: error while scanning row from \"%s\": %v", exerciseTable, err)
		}

		exercises = append(exercises, *se.toExercise())
	}
	err = rows.Err()
	if err != nil && err != sql.ErrNoRows {
		return nil, fmt.Errorf("models: error while iterating over rows from \"%s\": %v", exerciseTable, err)
	}

	return exercises, nil
}

func (es *exerciseService) AutoMigrate() error {
	createExerciseQ := fmt.Sprintf(`
		CREATE TABLE IF NOT EXISTS "%s" (
			id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
			name TEXT UNIQUE,
			calories BOOLEAN NOT NULL,
			distance BOOLEAN NOT NULL,
			reps BOOLEAN NOT NULL,
			time BOOLEAN NOT NULL,
			weight BOOLEAN NOT NULL
		)
	`, exerciseTable)
	_, err := es.Database.Exec(createExerciseQ)
	if err != nil {
		return fmt.Errorf("models: error while creating \"%s\" table: %v", exerciseTable, err)
	}

	return nil
}

func (es *exerciseService) ByLimitOffset(limit int, offset int) ([]Exercise, error) {
	if limit < 0 {
		return nil, fmt.Errorf("models: limit cannot be negative")
	}
	if offset < 0 {
		return nil, fmt.Errorf("models: offset cannot be negative")
	}

	exerciseQ := fmt.Sprintf(`
		SELECT id, name, calories, distance, reps, time, weight
		FROM "%s"
		ORDER BY name ASC
		LIMIT %d OFFSET %d
	`, exerciseTable, limit, offset)

	rows, err := es.Database.Query(exerciseQ)
	if err != nil {
		return nil, fmt.Errorf("models: error while querying \"%s\" by limit offset: %v", exerciseTable, err)
	}
	defer rows.Close()

	exercises := []Exercise{}
	for rows.Next() {
		var se sqlExercise
		err = rows.Scan(&se.id, &se.name, &se.calories, &se.distance, &se.reps, &se.time, &se.weight)
		if err != nil {
			return nil, fmt.Errorf("models: error while scanning row from \"%s\": %v", exerciseTable, err)
		}

		exercises = append(exercises, *se.toExercise())
	}
	err = rows.Err()
	if err != nil && err != sql.ErrNoRows {
		return nil, fmt.Errorf("models: error while iterating over rows from \"%s\": %v", exerciseTable, err)
	}

	return exercises, nil
}

func (es *exerciseService) ByName(name string) (*Exercise, error) {
	exr := &Exercise{Name: name}
	err := runExerciseValFuncs(
		exr,
		exerciseRequireName,
	)
	if err != nil {
		return nil, fmt.Errorf("models: %w", err)
	}

	exerciseQ := fmt.Sprintf(`
		SELECT id, name, calories, distance, reps, time, weight
		FROM "%s"
		WHERE name=?
	`, exerciseTable)

	var se sqlExercise
	row := es.Database.QueryRow(exerciseQ, exr.Name)
	err = row.Scan(&se.id, &se.name, &se.calories, &se.distance, &se.reps, &se.time, &se.weight)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, fmt.Errorf("models: error while querying \"%s\" by name: %v", exerciseTable, err)
	}

	return se.toExercise(), nil
}

func (es *exerciseService) Create(exr *Exercise) error {
	err := runExerciseValFuncs(
		exr,
		exerciseRequireName,
	)
	if err != nil {
		return fmt.Errorf("models: %w", err)
	}

	insertExerciseQ := fmt.Sprintf(`
		INSERT INTO "%s" (name, calories, distance, reps, time, weight)
		VALUES (?, ?, ?, ?, ?, ?)
	`, exerciseTable)

	_, err = es.Database.Exec(insertExerciseQ, exr.Name, exr.Calories, exr.Distance, exr.Reps, exr.Time, exr.Weight)
	if err != nil {
		return fmt.Errorf("models: error while inserting %s: %v", exerciseTable, err)
	}

	return nil
}

func (es *exerciseService) Delete(exr *Exercise) error {
	err := runExerciseValFuncs(
		exr,
		exerciseIDMinimum,
		exerciseRequireName,
	)
	if err != nil {
		return fmt.Errorf("models: %w", err)
	}

	deleteExerciseQ := fmt.Sprintf(`
		DELETE FROM "%s"
		WHERE name = ?
	`, exerciseTable)

	_, err = es.Database.Exec(deleteExerciseQ, exr.Name)
	if err != nil {
		return fmt.Errorf("models: error while deleting %s: %v", exerciseTable, err)
	}

	return nil
}

func (es *exerciseService) Update(exr *Exercise) error {
	err := runExerciseValFuncs(
		exr,
		exerciseIDMinimum,
		exerciseRequireName,
	)
	if err != nil {
		return fmt.Errorf("models: %w", err)
	}

	updateExerciseQ := fmt.Sprintf(`
		UPDATE "%s"
		SET name=?, calories=?, distance=?, reps=?, time=?, weight=?
		WHERE id=?
	`, exerciseTable)

	_, err = es.Database.Exec(updateExerciseQ, exr.Name, exr.Calories, exr.Distance, exr.Reps, exr.Time, exr.Weight, exr.ID)
	if err != nil {
		return fmt.Errorf("models: error while updating %s: %v", exerciseTable, err)
	}

	return nil
}

type exerciseValFunc func(*Exercise) error

func runExerciseValFuncs(exr *Exercise, fns ...exerciseValFunc) error {
	for _, fn := range fns {
		err := fn(exr)
		if err != nil {
			return err
		}
	}

	return nil
}

func exerciseIDMinimum(exr *Exercise) error {
	if exr.ID < 1 {
		return ErrExerciseInvalidID
	}

	return nil
}

func exerciseRequireName(exr *Exercise) error {
	if exr.Name == "" {
		return ErrExerciseInvalidName
	}

	return nil
}
