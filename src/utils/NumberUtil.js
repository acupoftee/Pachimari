'use strict';

/**
 * Utility class for handling numbers
 */
class NumberUtil {
    
    /**
     * Instantiates a new Number utility object for localization
     * @constructor
     */
    constructor() {}

    /**
     * Format a number to a locale
     * @param {number} number a Number to format (date, time, etc)
     * @param {String} [locale=en-US] Locale used to format the Number.
     */
    static format(number, locale='en-US') {
        return number.toLocaleString(locale, {
            minimumFractionDigits: 0
        });
    }
} 
module.exports = NumberUtil;