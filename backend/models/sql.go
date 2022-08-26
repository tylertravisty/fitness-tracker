package models

import (
	"database/sql"
	"fmt"
	"time"
)

func toBool(b sql.NullBool) bool {
	if b.Valid {
		return b.Bool
	} else {
		return false
	}
}

func toFloat64(f sql.NullFloat64) float64 {
	if f.Valid {
		return f.Float64
	} else {
		return -1
	}
}

func toInt64(i sql.NullInt64) int64 {
	if i.Valid {
		return i.Int64
	} else {
		return -1
	}
}

// TODO: remove panics and return error
func toLocalDateString(s sql.NullString, format string) string {
	loc, err := time.LoadLocation("Local")
	if err != nil {
		panic(fmt.Errorf("Error loading local time location: %v", err))
	}
	dateS := toString(s)
	// TODO: handle dateS == ""
	date, err := time.Parse(format, dateS)
	if err != nil {
		panic(fmt.Errorf("Error parsing date: %v", err))
	}

	return date.In(loc).Format(format)
}

func toString(s sql.NullString) string {
	if s.Valid {
		return s.String
	} else {
		return ""
	}
}
