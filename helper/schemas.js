'use strict'

const Ajv = require('ajv/dist/jtd').default
const fs = require('fs')

// Create a new AJV instance and make it public
const ajv = new Ajv()

let counter = 0
const schemaFolderPath = './schemas/'

// Read schemas from schema folder
try {
	const files = fs.readdirSync(schemaFolderPath)

	files
		.filter((f) => f.endsWith('.jtd.json'))
		.forEach((file) => {
			const name = file.split('.')[0]
			const schema = JSON.parse(fs.readFileSync(schemaFolderPath + file))

			ajv.addSchema(schema, name)

			counter++
		})
} catch (err) {
	console.error(err.message)
	process.exit(3)
}

console.log(`${counter} validation schemas loaded`)

// Distribute AJV instance with schemas
module.exports = ajv