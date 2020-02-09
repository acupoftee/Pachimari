'use strict'
const { ConsoleColors } = require('../constants')
const moment = require('moment')

/**
 * Class for logging info, errors, and warnings.
 */
class Logger {
/**
 * Log info to the console.
 * @param {String} message Message to log to console.
 */
  static info (message) {
    console.log(
			`${ConsoleColors.DIM}[${moment().format('lll')}]` +
			`${ConsoleColors.RESET} ` +
			`${ConsoleColors.FG_WHITE}${ConsoleColors.BG_CYAN}INFO` +
			`${ConsoleColors.RESET} » ${message}`)
  }

  /**
	 * Log a success to the console.
	 * @param {String} message Message to log to console.
	 */
  static success (message) {
    console.log(
			`${ConsoleColors.DIM}[${moment().format('lll')}]` +
			`${ConsoleColors.RESET} ` +
			`${ConsoleColors.FG_WHITE}${ConsoleColors.BG_GREEN}SUCCESS` +
			`${ConsoleColors.RESET} » ${message}`)
  }

  /**
   * Log an error to the console.
   * @param {String} message Message to log to console.
   */
  static error (message) {
    console.log(
			`${ConsoleColors.DIM}[${moment().format('lll')}]` +
			`${ConsoleColors.RESET} ` +
			`${ConsoleColors.FG_WHITE}${ConsoleColors.BG_RED}ERROR` +
			`${ConsoleColors.RESET} » ${message}`)
  }

  /**
	 * Log a warning to the console.
	 * @param {String} message Message to log to console.
	 */
  static warn (message) {
    console.log(`${ConsoleColors.DIM}[${moment().format('lll')}] ${ConsoleColors.RESET} ${ConsoleColors.FG_BLACK}${ConsoleColors.BG_YELLOW}WARN ${ConsoleColors.RESET} » ${message}`)
  }

  /**
	 * Log a message to the console with a custom tag.
	 * @param {String} tag Tag of the log.
	 * @param {String} message Message to log to console.
	 */
  static custom (tag, message) {
    console.log(
			`${ConsoleColors.DIM}[${moment().format('lll')}]` +
			`${ConsoleColors.RESET} ` +
			`${ConsoleColors.FG_WHITE}${ConsoleColors.BG_GREEN}${tag.toUpperCase()}` +
			`${ConsoleColors.RESET} » ${message}`)
  }
}
module.exports = Logger
