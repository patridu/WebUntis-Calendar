'use strict'

// Import modules
const http = require('http')
const getWebuntisAnon = require('./webuntis/get-webuntis-anon')
const UntisDate = require('./helper/untis-date')
const Parameters = require('./helper/parameters')
const ical = require('ical-generator').default

const server = new http.Server()

const log = (text) => {
	console.log(new Date().toLocaleString(), '-', text)
}

server.addListener('request', async (req, res) => {
	try {
		// Read parameters from config and url
		const params = new Parameters(req.url)

		const conn = await getWebuntisAnon(params.server, params.school)

		// Request timetable from server
		const startDay = new UntisDate().changeMonth(-params.monthsBefore).getUntisDay()
		const endDay = new UntisDate().changeMonth(params.monthsAfter).getUntisDay()
		const timetable = await conn.getTimetable(params.class, startDay, endDay)

		// Convert server response to a calendar
		const calendar = ical({ name: 'Timetable' })

		for (let entry of timetable) {
			let date = new UntisDate().setUntisDay(entry.date.toString())

			calendar.createEvent({
				start: date.setUntisTime(entry.startTime.toString()).getDate(),
				end: date.setUntisTime(entry.endTime.toString()).getDate(),
				summary: entry.su[0]?.name ?? '?',
				location: entry.ro[0]?.name
			})
		}

		// Send the finished calendar
		calendar.serve(res)

		log(`Served ${timetable.length} entries for class ${params.class}`)

		// End server session gracefully
		conn.finish()
	} catch (e) {
		log(`Failed to serve entries: ${e.message ?? 'Unknown error'}`)
		res.end(e.toString())
	}
})

// Start webserver
const port = process.env.PORT ?? 8081
server.listen(port, '127.0.0.1', () => console.log(`Listening at port ${port}`))
