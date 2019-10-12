'use strict'

/**
 * Utility class for handling numbers
 */
class NumberUtil {
  /**
     * Format a number to a locale
     * @param {Number} number a Number to format (date, time, etc)
     * @param {String} [locale=en-US] Locale used to format the Number.
     */
  static format (number, locale = 'en-US') {
    return number.toLocaleString(locale, {
      minimumFractionDigits: 0
    })
  }

  /**
   * Returns a new time string
   * @param {Number} number the numeric representation of the time
   */
  static toTimeString (number) {
    const h = Math.floor(number / 3600)
    const m = Math.floor(number % 3600 / 60)
    const s = Math.floor(number % 3600 % 60)

    return h + ':' + ('0' + m).slice(-2) + ':' + ('0' + s).slice(-2)
  }

  /**
     * Returns the ordinal of a number
     * @param {Number} number a Number to convert
     */
  static ordinal (number) {
    const i = number % 10; const j = number % 100
    if (i === 1 && j !== 11) {
      return number + 'st'
    } else if (i === 2 && j !== 12) {
      return number + 'nd'
    } else if (i === 3 && j !== 13) {
      return number + 'rd'
    } else {
      return number + 'th'
    }
  }
}
module.exports = NumberUtil
