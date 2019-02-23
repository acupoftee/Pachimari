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

    static toTimeString(number) {
        let h = Math.floor(number / 3600);
        let m = Math.floor(number % 3600 / 60);
        let s = Math.floor(number % 3600 % 60);
    
        return ('0' + h).slice(-2) + ":" + ('0' + m).slice(-2) + ":" + ('0' + s).slice(-2);
    }

    /**
     * Returns the ordinal of a number
     * @param {number} number a Number to convert
     */
    static ordinal(number) {
        let i = number % 10, j = number % 100;
        if (i === 1 && j !== 11) {
            return number + 'st';
        } else if (i === 2 && j !== 12) {
            return number + 'nd';
        } else if (i === 3 && j !== 13) {
            return number + 'rd';
        } else {
            return number + 'th';
        }
    }
} 
module.exports = NumberUtil;