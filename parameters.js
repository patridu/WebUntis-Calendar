'use strict'

const Ajv = require('ajv/dist/jtd').default
const schemas = require('./schemas')

// Read configuration file
try {
	var jsonConfig = require('./config.json')
} catch (e) {
	console.error('config.json not found. Try copying default-config.json and renaming it to config.json')
	process.exit(2)
}

// Validate configuration file
const validate = schemas.getSchema('config')

if (!validate(jsonConfig)) {
	console.error(validate.errors)
	process.exit(2)
}

module.exports = class Parameters {
	/**
	 * Compile request parameters from all sources and check for missing ones
	 * @param {string} url
	 * @throws Will throw an error if a parameter is missing
	 */
	constructor(url) {
		const params = new URL(url, 'http://irgendwas').searchParams
		const paramConfig = {
			class: params.get('c') ?? params.get('class')
		}

		for (let key of Object.keys(paramConfig)) {
			if (!paramConfig[key]) throw new Error(`Parameter "${key}" is missing`)
		}

		Object.assign(this, jsonConfig, paramConfig)
	}
}
