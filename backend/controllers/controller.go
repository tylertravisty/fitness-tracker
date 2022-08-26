package controllers

import (
	"errors"
	"fmt"
	"log"

	"github.com/tylertravisty/fitness-tracker/backend/models"
)

var (
	ErrWorkoutAddExercise = errors.New("error adding exercise to workout")
	ErrWorkoutCreate      = errors.New("error creating workout")
	ErrWorkoutUpdate      = errors.New("error updating workout")
)

type Controller struct {
	Log *log.Logger
}

func (c *Controller) userError(err error, userErr error) error {
	if err == nil {
		return nil
	}

	uerr := errors.Unwrap(err)
	verr, ok := uerr.(models.ValidatorError)
	if ok {
		return verr
	} else {
		c.logError(err)
		return userErr
	}
}

func (c *Controller) logError(err error) {
	c.logf(fmt.Sprintf("[ERROR] %v\n", err))
}

func (c *Controller) logf(s string) {
	if c.Log != nil {
		c.Log.Printf(s)
	} else {
		log.Printf(s)
	}
}
