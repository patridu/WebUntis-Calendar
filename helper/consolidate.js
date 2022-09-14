'use strict'

/**
 * Unite lessons next to each other so they appear as a single block in the calendar
 * @param {*[]} timetable A timetable returned from WebUntis
 * @returns {*[]} Consolidated timetable
 */
module.exports = (timetable) => {

	timetable.sort((a, b) => (a.date === b.date) ? (a.startTime - b.startTime) : (a.date - b.date))

	timetable.reduceRight((next, current, index) => {
		if (next && next.su[0] && current.su[0]
			&& current.su[0].name === next.su[0].name
			&& current.ro[0]?.name === next.ro[0]?.name
			&& (current.endTime === next.startTime || current.startTime === next.startTime)) {

			// Lengthen current lesson and delete next
			current.endTime = next.endTime
			timetable.splice(index + 1, 1)
		}
		return current
	})

	return timetable
}