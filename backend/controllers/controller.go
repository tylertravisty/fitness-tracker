package controllers

import (
	"errors"
	"fmt"
	"log"
	"path/filepath"
	"runtime"

	"github.com/tylertravisty/fitness-tracker/backend/models"
)

var (
	ErrTimeLocation          = errors.New("error loading time location")
	ErrWorkoutAddExercise    = errors.New("error adding exercise to workout")
	ErrWorkoutCreate         = errors.New("error creating workout")
	ErrWorkoutParseDate      = errors.New("error parsing workout date")
	ErrWorkoutQuery          = errors.New("error querying workout")
	ErrWorkoutUpdate         = errors.New("error updating workout")
	ErrWorkoutsQuery         = errors.New("error querying workouts")
	ErrWorkoutExerciseUpdate = errors.New("error updating workout exercise result")
)

type Controller struct {
	Log *log.Logger
}

func (c *Controller) userError(prefix string, err error, defaultErr error) error {
	if err == nil {
		return nil
	}

	var logErr error
	if prefix != "" {
		logErr = fmt.Errorf("%s: %v", prefix, err)
	} else {
		logErr = err
	}

	c.logError(logErr, 3)

	var userErr models.UserError
	if errors.As(err, &userErr) {
		return userErr
	}

	return defaultErr
}

//func (c *Controller) userErrorWithMsg(msg string, err error, defaultErr error) error {
//	if err == nil {
//		return nil
//	}
//
//	merr := fmt.Errorf("%s: %w", msg, err)
//
//	return c.userError(merr, defaultErr)
//}

func (c *Controller) logError(err error, traceSkip int) {
	trace := printTrace(traceSkip)

	c.logf(fmt.Sprintf("[ERROR] %s: %v\n", trace, err))
}

func (c *Controller) logf(s string) {
	if c.Log != nil {
		c.Log.Printf(s)
	} else {
		log.Printf(s)
	}
}

func printTrace(skip int) string {
	pc, file, line, ok := runtime.Caller(skip)

	fnName := "[func]"
	if !ok {
		return fmt.Sprintf("[file]:[line]: %s", fnName)
	}

	fn := runtime.FuncForPC(pc)
	if fn != nil {
		_, fnName = filepath.Split(fn.Name())
	}

	return fmt.Sprintf("%s:%d: %s", file, line, fnName)
}
