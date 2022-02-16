'use strict'

const axios = require('axios').default

/**
 * Wrapper for a WebUntis connection
 * Call finish() to quit gracefully
 * @param {string} server Base URL of the server
 * @param {string} cookieHeader A valid cookie header string. Obtain one through a factory function
 */
class WebUntis {
	/** @type {AxiosInstance} */
	#axiosPrefab

	constructor(server, cookieHeader) {
		this.#axiosPrefab = axios.create({
			method: 'POST',
			baseURL: `https://${server}`,
			maxRedirects: 0,
			headers: {
				'Cache-Control': 'no-cache',
				Pragma: 'no-cache',
				'X-Requested-With': 'XMLHttpRequest',
				Cookie: cookieHeader
			}
		})
	}

	/**
	 * Get timetable for a class in a specified timeframe
	 * @param {string} classId The id of the class the timetable is for
	 * @param {string} from YYYYMMDD
	 * @param {string} to YYYYMMDD
	 * @returns {Promise<object>} Timetable async
	 */
	async getTimetable(classId, from, to) {
		const result = await this.#axiosPrefab({
			url: '/WebUntis/jsonrpc.do',
			data: {
				id: 'CalendarUntis',
				method: 'getTimetable',
				params: {
					id: classId,
					type: 1,
					startDate: from,
					endDate: to
				},
				jsonrpc: '2.0'
			}
		})

		if (result.data.error?.message) throw new Error(`Server says: ${result.data.error.message}`)
		if (!result.data.result) throw new Error('Unexpected response')

		console.log(result.data)

		return result.data.result
	}

	async logout() {}
}

/**
 * Get a new anonymous WebUntis connection
 * @param {string} server e.g. melpomene.webuntis.com
 * @param {string} school School name
 * @returns {WebUntis} A new WebUntis connection
 */
module.exports.getAnonymous = async (server, school) => {
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

	if (!result.data?.result) throw new Error(`Could not log in on ${server}:${school}`)

	// Assemble cookie header
	if (!result.headers['set-cookie']?.length == 2)
		throw new Error(`Unexpected cookie header with ${server}:${school}`)

	let cookieHeader = result.headers['set-cookie'].map((val) => val.split(';')[0]).join('; ')

	return new WebUntis(server, cookieHeader)
}
