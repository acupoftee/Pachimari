'use strict'

/**
 * Represents an Account Object
 */
class Account {
  /**
   * Represents an account object for a Player and Competitor
   * @constructor
   * @param {number} id The integer identifier for an Acccount
   * @param {String} type The Account platform (i.e. Twitter, Instagram, Twitch, etc.)
   * @param {String} url The Account url
   */
  constructor (id, type, url) {
    this._id = id
    this._type = type
    this._url = url
  }

  /**
   * Retrieves the Account ID
   * @type {number}
   * @returns an Account id for a Player or Competitor
   */
  get id () {
    return this._id
  }

  /**
   * Retrieves the Account type.
   * @type {Srting}
   * @returns an Account type for a Player or Competitor
   */
  get type () {
    return this._type
  }

  /**
   * Retrieves the Account URL
   * @type {String}
   * @returns an Account URL for a Player or Competitor
   */
  get url () {
    return this._url
  }
}
module.exports = Account
