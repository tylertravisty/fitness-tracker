Workout tracker notes

# Doing

Refactor opening workoutPage code
Need to fix ordering with opening workout page
- open in .then() part of GetWorkoutWithExercises
- need to figure out which values to set (workoutPage or workoutPageEdit)
- pass in function to getWorkoutWithExercises to set correct values?
	- function gets called in .then()
- getWorkoutWithExercises is broken

Add icons to workouts list
- left side

Exercise menu 
	- tell user which workouts use that exercise?
	- add info button to drop down menu which shows user which workouts use that exercise
		- add link to that exercise?

Pull to refresh
- scroll from top
- top hides under header

Workout
- Add rounds to workout?

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

Workouts
- On back, set scroll position to same as before opening workout page
	- Save scroll position when opening workout page
	- Set scroll position when closing workout page

Datetime picker
- Use Go to format datetime string in better format

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

Database null values
- change all models to use pointers to handle nulls

Re-order exercises in a workout
- add a position field in the workoutexercise table
- when querying workoutexercises, order by position field (ASC)

AddExerciseModal in Workout edit page
- figure out how to paginate exercises in the drop-down menu instead of getting all of them at once.

Track user's weight in app

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
