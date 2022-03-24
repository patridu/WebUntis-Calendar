'use strict'

const WebUntis = require('./webuntis')
const axios = require('axios').default
const schemas = require('../helper/schemas')

/**
 * Get a new anonymous WebUntis connection
 * @param {string} server e.g. melpomene.webuntis.com
 * @param {string} school School name
 * @returns {Promise<WebUntis>} A new WebUntis connection
 */
module.exports = async (server, school) => {
	let result = null

	try {
		result = await axios({
			method: 'POST',
			url: `https://${server}/WebUntis/jsonrpc_intern.do`,
			params: {
				m: 'getUserData2017',
				school,
				v: 'i2.2'
			},
			data: {
				id: 'CalendarUntis',
				method: 'getUserData2017',
				params: [
					{
						auth: {
							// This login was taken from https://github.com/SchoolUtils/WebUntis
							clientTime: new Date().getTime(),
							user: '#anonymous#',
							otp: 100170
						}
					}
				],
				jsonrpc: '2.0'
			}
		})
	} catch (e) {
		throw new Error(`Axios encountered an error: ${e.message}`)
	}

	const validate = schemas.getSchema('anonymous-auth')

	if (!validate(result.data)) {
		throw new Error(`Could not log in on ${server}:${school}`)
	}

	// Assemble cookie header
	if (result.headers['set-cookie']?.length !== 2)
		throw new Error(`Unexpected cookie header with ${server}:${school}`)

	let cookieHeader = result.headers['set-cookie'].map((val) => val.split(';')[0]).join('; ')

	return new WebUntis(server, cookieHeader)
}