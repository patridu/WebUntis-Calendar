'use strict'

module.exports = class UntisDate {
	/**
	 * Thin wrapper around {@link Date} tailored for the WebUntis API
	 */
	constructor() {
		this.date = new Date()
	}

	/**
	 * Go forward or backward in time
	 * @param {number} amount The number of days to move
	 * @returns {UntisDate} itself
	 */
	changeDay(amount) {
		const newDate = new Date(this.date)
		newDate.setDate(newDate.getDate() + amount)
		this.date = newDate
		return this
	}

	/**
	 * Go forward or backward in time
	 * @param {number} amount The number of months to move
	 * @returns {UntisDate} itself
	 */
	changeMonth(amount) {
		const newDate = new Date(this.date)
		newDate.setMonth(newDate.getMonth() + amount)
		this.date = newDate
		return this
	}

	/**
	 * Get the represented day in Untis format
	 * @returns {string} Untis date (YYYYMMDD)
	 */
	getUntisDay() {
		const month = (this.date.getMonth() + 1).toString().padStart(2, '0')
		const day = this.date.getDate().toString().padStart(2, '0')
		return '' + this.date.getFullYear() + month + day
	}

	/**
	 * Set the day in Untis format
	 * @param {string} val Untis date (YYYYMMDD)
	 * @returns {UntisDate} itself
	 */
	setUntisDay(val) {
		if (val.length !== 8) throw new Error(`Untis date ${val} had an unexpected length`)

		this.date.setFullYear(parseInt(val.substr(0, 4)))
		this.date.setMonth(parseInt(val.substr(4, 2)) - 1)
		this.date.setDate(parseInt(val.substr(6, 2)))

		return this
	}

	/**
	 * Get the represented time in Untis format
	 * @returns {string} Untis time (HHMM)
	 */
	getUntisTime() {
		const hours = this.date.getHours().toString().padStart(2, '0')
		const minutes = this.date.getMinutes().toString().padStart(2, '0')
		return hours + minutes
	}

	/**
	 * Set the time in Untis format
	 * @param {string} val Untis time (HHMM)
	 * @returns {UntisDate} itself
	 */
	setUntisTime(val) {
		if (val.length !== 4) throw new Error(`Untis time ${val} had an unexpected length`)

		this.date.setHours(parseInt(val.substr(0, 2)))
		this.date.setMinutes(parseInt(val.substr(2, 2)))

		return this
	}
}
