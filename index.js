'use strict'

// Prevent quitting for ease of debugging
setInterval(() => {}, 500)

// Read configuration
require('dotenv').config()

// Import modules
const http = require('http')
const webuntis = require('./webuntis')

// Setup http server
const server = new http.Server()

server.addListener('request', async (req, res) => {

	console.log('Got request!')
	
	const wantedClass = new URL(req.url, `http://${req.headers.host}`).searchParams.get('c')

	const conn = await webuntis.getAnonymous(process.env.SERVER, process.env.SCHOOL)

	const timetable = await conn.getTimetable(wantedClass, '20220216', '20220216')
	timetable.sort((a, b) => {
		return a.date - b.date
	})

	for (let lesson of timetable) {
		res.write(
			`${lesson.date} ${lesson.startTime} - ${lesson.endTime}: ${lesson.su[0]?.longname ?? 'Fehler'}, ${lesson.lstype}, ${lesson.code}\n`
		)
	}

	res.end('Done!')
	conn.logout()
})

const port = process.env.PORT ?? 2003
server.listen(port, '127.0.0.1', () => console.log(`Listening at port ${port}`))
