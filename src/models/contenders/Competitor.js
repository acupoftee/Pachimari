'use strict'

const { Collection } = require('discord.js')

/**
 * Represents a competing Overwatch League team
 * https://api.overwatchleague.com/v2/teams/TEAM_ID?locale=en_US
 */
class Competitor {
  /**
   * @description Instantiates a new Competitor/Overwatch League Team Object
   * @constructor
   * @param {number} id competitor id
   * @param {string} name competitor name
   * @param {string} abbreviatedName abbreviated competitor name
   * @param {string} logo competitor logo
   * @param {string} primaryColor primary team color
   * @param {string} secondaryColor secondary team color
   * @param {string} region origin region
   */
  constructor (id, name, abbreviatedName, logo,
    primaryColor = '#afe915', secondaryColor = '#afe915', region) {
    this._id = id
    this._name = name
    this._abbreviatedName = abbreviatedName
    this._logo = logo
    this._primaryColor = primaryColor
    this._secondaryColor = secondaryColor
    this._region = region

    /**
     * a Collection of Players
     * @type {Collection<string, Object}
     */
    this._players = new Collection()
  }

  /**
   * Returns a Competitor id
   * @returns {number} a competitor id
   */
  get id () {
    return this._id
  }

  /**
   * Returns a Competitor's name (team name)
   * @returns {string} team name
   */
  get name () {
    return this._name
  }

  /**
   * Returns a Competitor's abbreviated name
   * (3 letter team name abbreviation)
   * @returns {string} abbreviated competitor name
   */
  get abbreviatedName () {
    return this._abbreviatedName
  }

  /**
   * Returns a Team's logo URL
   * @returns {string} logo url
   */
  get logo () {
    return this._logo
  }

  /**
   * Returns a Competitor's primary color
   * @returns {string} a primary Hex color
   */
  get primaryColor () {
    return this._primaryColor
  }

  /**
   * Returns a Competitor's secondary color
   * @returns {string} a secondary Hex color
   */
  get secondaryColor () {
    return this._secondaryColor
  }

  /**
   * Returns a Competitor's region
   * @returns {string} a region
   */
  get region () {
    return this._region
  }

  /**
   * Returns a Collection of Players for a Competitor
   * @returns {Collection<string, Object} a Competitor's roster
   */
  get players () {
    return this._players
  }
}
module.exports = Competitor
