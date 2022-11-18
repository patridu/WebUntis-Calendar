'use strict'

/**
 * Unite lessons next to each other so they appear as a single block in the calendar
 * @param {*[]} timetable A timetable returned from WebUntis
 * @returns {*[]} Consolidated timetable
 */
module.exports = (timetable) => {

	timetable.sort((a, b) => {
		if (a.date !== b.date) return a.date - b.date
		if (a.startTime !== b.startTime) return a.startTime - b.startTime
		return a.su.localeCompare(b.su)
	})

	// First merge concurrent lessons with the same subject...
	timetable.reduceRight((next, current, index) => {
		if (!next) return current
		if (current.su !== next.su) return current
		if (current.startTime !== next.startTime || current.endTime !== next.endTime || current.date !== next.date) return current

		current.ro = new Set([...current.ro, ...next.ro])
		timetable.splice(index + 1, 1)

		return current
	})

	// Then merge consecutive lessons
	timetable.reduceRight((next, current, index) => {
		if (!next) return current
		if (current.su !== next.su) return current
		if (current.endTime !== next.startTime || current.date !== next.date) return current

		// Check if rooms are the same
		if (current.ro.length !== next.ro.length) return current
		if (![...current.ro].every(val => next.ro.has(val))) return current

		current.endTime = next.endTime
		timetable.splice(index + 1, 1)
	})

	return timetable
}