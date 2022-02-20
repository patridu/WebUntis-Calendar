'use strict'

// Read configuration
const config = require('./config.json')

// Import modules
const http = require('http')
const webuntis = require('./webuntis')
const UntisDate = require('./untis-date')
const ical = require('ical-generator').default

const server = new http.Server()

server.addListener('request', async (req, res) => {
	console.log('Got request!')

	try {
		// Read parameters either from config or url
		const params = new URL(req.url, 'http://irgendwas').searchParams
		const settings = {
			server: config.forcedServer ?? params.get('server'),
			school: config.forcedSchool ?? params.get('school') ?? params.get('s'),
			class: config.forcedClass ?? params.get('class') ?? params.get('c'),
			monthsBefore: config.monthsBefore ?? params.get('monthsBefore'),
			monthsAfter: config.monthsAfter ?? params.get('monthsAfter')
		}

		// Check if all needed values are present
		if (!settings.server) throw new Error('Server must be set as request parameter if not given in config.json')
		if (!settings.school) throw new Error('School must be set as request parameter if not given in config.json')
		if (!settings.class) throw new Error('Class must be set as request parameter if not given in config.json')
		if (!settings.monthsBefore) throw new Error('Months before must be set as request parameter if not given in config.json')
		if (!settings.monthsAfter) throw new Error('Months after must be set as request parameter if not given in config.json')

		const conn = await webuntis.getAnonymous(settings.server, settings.school)

		const startDay = new UntisDate().changeMonth(-settings.monthsBefore).getUntisDay()
		const endDay = new UntisDate().changeMonth(settings.monthsAfter).getUntisDay()
		const timetable = await conn.getTimetable(settings.class, startDay, endDay)

		const calendar = ical()

		timetable.sort((a, b) => {
			return a.date - b.date
		})

		for (let lesson of timetable) {
			res.write(
				`${lesson.date} ${lesson.startTime} - ${lesson.endTime}: ${lesson.su[0]?.longname ?? 'Fehler'}, ${lesson.lstype}, ${lesson.code}\n`
			)
		}

		res.end('Done!')
		conn.finish()
	} catch (e) {
		console.error(e)
		res.end(e.toString())
	}
})

// Start webserver
const port = process.env.PORT ?? 2003
server.listen(port, '127.0.0.1', () => console.log(`Listening at port ${port}`))
