package models

import (
	"database/sql"
	"fmt"
)

type service struct {
	name        string
	automigrate migrationFunc
}

type Services struct {
	ExerciseS        ExerciseService
	WorkoutS         WorkoutService
	WorkoutExerciseS WorkoutExerciseService
	Database         *sql.DB
	dbServices       []service
}

type ServicesConfig func(*Services) error

func NewServices(cfgs ...ServicesConfig) (*Services, error) {
	var s Services
	for _, cfg := range cfgs {
		err := cfg(&s)
		if err != nil {
			return nil, err
		}
	}
	return &s, nil
}

func WithDatabase(dbFile string) ServicesConfig {
	return func(s *Services) error {
		db, err := sql.Open("sqlite3", "file:"+dbFile+"?_foreign_keys=ON")
		if err != nil {
			return fmt.Errorf("models: error while opening database file '%s': %v", dbFile, err)
		}

		s.Database = db
		return nil
	}
}

func WithExercise() ServicesConfig {
	return func(s *Services) error {
		s.ExerciseS = NewExerciseService(s.Database)
		s.dbServices = append(s.dbServices, service{exerciseTable, s.ExerciseS.AutoMigrate})
		return nil
	}
}

func WithWorkout() ServicesConfig {
	return func(s *Services) error {
		s.WorkoutS = NewWorkoutService(s.Database)
		s.dbServices = append(s.dbServices, service{workoutTable, s.WorkoutS.AutoMigrate})

		return nil
	}
}

func WithWorkoutExercise() ServicesConfig {
	return func(s *Services) error {
		s.WorkoutExerciseS = NewWorkoutExerciseService(s.Database)
		s.dbServices = append(s.dbServices, service{workoutExerciseTable, s.WorkoutExerciseS.AutoMigrate})

		return nil
	}
}

func (s *Services) Close() error {
	return nil
}

type migrationFunc func() error

func (s *Services) AutoMigrate() error {
	for _, service := range s.dbServices {
		err := service.automigrate()
		if err != nil {
			return fmt.Errorf("models: error while auto-migrating %s service: %v", service.name, err)
		}
	}

	return nil
}

func (s *Services) DestructiveReset() error {
	for _, service := range s.dbServices {
		dropTableQ := fmt.Sprintf("DROP TABLE IF EXISTS \"%s\"", service.name)
		_, err := s.Database.Exec(dropTableQ)
		if err != nil {
			return fmt.Errorf("models: error while dropping table \"%s\": %v", service.name, err)
		}
	}

	return s.AutoMigrate()
}
