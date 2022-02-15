'use strict'

// Read configuration
require('dotenv').config()

// Import modules
const http = require('http')
const webuntis = require('webuntis')

// Setup http server
const server = new http.Server()

server.addListener('request', async (req, res) => {

	const url = new URL(req.url, `http://${req.headers.host}`)
	const wantedClass = url.searchParams.get('c')
	
	const conn = new webuntis.WebUntisAnonymousAuth(process.env.SCHOOL, process.env.SERVER)
	await conn.login()

	const classes = await conn.getClasses()

	let id = 0
	for (let c of classes) {
		if (c.name === wantedClass) {
			id = c.id
			console.log(`ID is ${id}`)
			break
		}
	}

	const timetable = await conn.getTimetableForToday(id, webuntis.TYPES.CLASS)
	timetable.sort((a, b) => { return a.startTime - b.startTime })

	for (let lesson of timetable) {
		res.write(`${lesson.startTime} - ${lesson.endTime}: ${lesson.su[0].longname}, ${lesson.lstype}, ${lesson.code}\n`)
	}
	
	res.end('Done!')
	conn.logout()
})

const port = process.env.PORT ?? 2003
server.listen(port, '127.0.0.1', () => console.log(`Listening at port ${port}`))