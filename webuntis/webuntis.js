'use strict'

const axios = require('axios').default
const schemas = require('../helper/schemas')

/**
 * Wrapper for a WebUntis connection.
 * Call finish() to quit gracefully.
 * @param {string} server Base URL of the server
 * @param {string} cookieHeader A valid cookie header string. Obtain one through a factory function
 */
module.exports = class WebUntis {
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
	 * Get timetable for a class in a specified time frame
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
					options: {
						element: {
							id: classId,
							type: 1
						},
						startDate: from,
						endDate: to,
						roomFields: ['name'],
						subjectFields: ['name']
					}
				},
				jsonrpc: '2.0'
			}
		})

		if (result.data.error?.message) throw new Error(`WebUntis could not process request. Check if class ID is correct`)

		const validate = schemas.getSchema('timetable')
		if (!validate(result.data)) throw new Error('Unexpected WebUntis response')

		return result.data.result
	}

	/**
	 * Close this session gracefully.
	 * You will no longer be able to get data through this instance.
	 */
	async finish() {
		const result = await this.#axiosPrefab({
			url: '/WebUntis/jsonrpc.do',
			data: {
				id: 'CalendarUntis',
				method: 'logout',
				params: {},
				jsonrpc: '2.0'
			}
		})
	}
}
