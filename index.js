'use strict'

// Import modules
const http = require('http')
const getWebuntisAnon = require('./webuntis/get-webuntis-anon')
const UntisDate = require('./helper/untis-date')
const Parameters = require('./helper/parameters')
const ical = require('ical-generator').default

const server = new http.Server()

server.addListener('request', async (req, res) => {
	try {
		// Read parameters either from config or url
		const params = new Parameters(req.url)

		console.log('Got request: ', params)

		const conn = await getWebuntisAnon(params.server, params.school)

		const startDay = new UntisDate().changeMonth(-params.monthsBefore).getUntisDay()
		const endDay = new UntisDate().changeMonth(params.monthsAfter).getUntisDay()
		const timetable = await conn.getTimetable(params.class, startDay, endDay)

		const calendar = ical({ name: 'Time table' })

		throw new Error('Sample error')

		calendar.serve(res)
		conn.finish()
	} catch (e) {
		console.error(e)
		res.end(e.toString())
	}
})

// Start webserver
const port = process.env.PORT ?? 8080
server.listen(port, '127.0.0.1', () => console.log(`Listening at port ${port}`))
