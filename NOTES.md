Workout tracker notes

# Doing

WorkoutExercise data model
- Update: test that nil values are stored as null in database

- TimerFormControl
	- handle null timer value passed into it
	- add functionality to disable input box
	- refactor all return statements to make changes easier to implement

Workout frontend
- Move Exercise input boxes to its own component
	- add disabled={props.disabled} to each Form.Control
	- pass in props.WorkoutExerciseChange, disabled
- Finish adding onChange handlers to the workout input boxes
- Handle actual workoutexercise data object
- duplicating loop to render each exercise and input boxes in the workout.
	- move to its own component.
	- add variable to make input boxes editable/non-editable; when workout is in edit mode, exercise input boxes are frozen/non-editable.

Timer bug
- Timer boxes all use the same variable to decide if box should be greyed out.

Workout
- Edit workout
	- Add exercises to workout
- Submit button to save results once entered
- Add rounds to workout?
- Delete button on workout page (not in list)


Parsing Date:
- should dates be stored in standard format to make conversions in frontend easier?
	- Issue: not storing seconds - can only create one workout per minute due to unique date constraint. If stored with seconds, user can create one workout per second.
- timezone
	- should user set global timezone to use for displaying?
	- should datetimes be displayed in local timezone?
	- should datetimes be displayed in timezone in which it was recorded?
		- will create a workout list of different timezones
		- will need to store what timezone was used
		- will need to allow user to change timezone

Workout model
- Add time field to workout (amount of time to complete workout)
	- stored as separate time field from date (call it something different? clock?)
- Should workout have its own calories field to record calories for entire workout?


Workouts
- On back, set scroll position to same as before opening workout page
	- Save scroll position when opening workout page
	- Set scroll position when closing workout page

Datetime picker
- Use Go to format datetime string in better format

Database null values
- How to handle these?

Frontend:
- Errors
	- Display errors better
		- Figure out what values need to be reset/reloaded on error
- Start page
	- Past workouts
	- Schedule
	- Record Workout (select the workout)
- Menu:
	- Exercises
		- List exercises
		- Define exercise button -> modal
	- Workouts
		- List workouts
		- Define workout button -> modal
	- Paginate on scroll
- Define Exercise page
	- Input name
	- Type: (strength[weight, reps], bodyweight[], cardio[time, distance])
		- weight, reps, time, distance, calories
- Define Workout page
	- Input name
	- Add Exercises
		- Select type (weight, reps, distance, calories, time)
	- Select type (rounds, timed, etc.)

# To Do

Track weight in app

SQL functions:
	- return error values, including ErrNullValue to indicate null value

sqlToStruct functions:
	- how to handle null values?

Types of exercise
- Reps
- Distance (units: meters, miles, etc.)
- Calories

Workout
- Rounds/Sets of exercises
	- Add "rounds" button in frontend
	- "Rounds" button duplicates previous exercises in database (workout_exercise)

First start
- Create config folder in standard location
- Create database file

# Future Ideas

# Plan
1. Define an exercise
	- frontend:
		- create an exercise
		- input results
	- backend:
		- save an exercise
		- save the results
2. Define a workout
	- frontend:
		- create a workout, add exercises
		- input results
	- backend:
		- save a workout
		- save the results
3. Track/View results
4. Track/View progress
	- Progress tab
		- list by workout
		- list by event/exercise

Frontend: React
Backend: Go
Datastore: SQLite

# Notes

Infinite scroll:
https://upmostly.com/tutorials/build-an-infinite-scroll-component-in-react-using-react-hooks
