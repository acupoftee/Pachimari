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
   * @param {number} divisionId competitor division id
   * @param {string} name competitor name
   * @param {string} abbreviatedName abbreviated competitor name
   * @param {string} logo competitor logo
   * @param {string} logoName competitor logo name
   * @param {string} altDark competitor dark logo
   * @param {string} location competitor location
   * @param {string} primaryColor primary team color
   * @param {string} secondaryColor secondary team color
   * @param {string} tertiaryColor teritary team color
   * @param {string} website competitor's website
   * @param {number} placement competitor's league placement
   * @param {number} matchWin number of wins
   * @param {number} matchLoss number of losses
   * @param {number} matchDraw number of draws
   */
  constructor (id, divisionId, name, abbreviatedName, logo, logoName, altDark, location,
    primaryColor, secondaryColor, tertiaryColor, website,
    placement, matchWin, matchLoss, matchDraw) {
    this._id = id
    this._divisionId = divisionId
    this._name = name
    this._abbreviatedName = abbreviatedName
    this._logo = logo
    this._logoName = logoName
    this._altDark = altDark
    this._location = location
    this._primaryColor = primaryColor
    this._secondaryColor = secondaryColor
    this._tertiaryColor = tertiaryColor
    this._website = website
    this._placement = placement
    this._matchWin = matchWin
    this._matchLoss = matchLoss
    this._matchDraw = matchDraw

    /**
     * a Collection of Players
     * @type {Collection<string, Object}
     */
    this._players = new Collection()

    /**
     * a Collection of Accounts
     * @type {Collection<string, Object}
     */
    this._accounts = new Collection()
  }

  /**
   * Returns a Competitor id
   * @returns {number} a competitor id
   */
  get id () {
    return this._id
  }

  /**
   * Returns a Competitor's division id
   * @returns {number} a competitor's division id
   */
  get divisionId () {
    return this._divisionId
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
   * Returns a Team's logo name
   * @returns {string} logo name
   */
  get logoName () {
    return this._logoName
  }

  /**
   * Returns a Team's dark logo URL
   * @returns {string} dark logo url
   */
  get altDark () {
    return this._altDark
  }

  /**
   * Returns a Competitor's location
   * @returns {string} competitor's location
   */
  get location () {
    return this._location
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
   * Returns a Competitor's tertiary color
   * @returns {string} a tertiary Hex color
   */
  get tertiaryColor () {
    return this._tertiaryColor
  }

  /**
   * Returns a Competitor's website url
   * @returns {string} a website url
   */
  get website () {
    return this._website
  }

  /**
   * Returns a Competitor's current placement in the League
   * @returns {number} current placement
   */
  get placement () {
    return this._placement
  }

  /**
   * Sets the competitor's placement
   * @param {number} placement the competitor's current standing
   */
  setPlacement (placement) {
    this._placement = placement
  }

  /**
   * Returns a Competitor's match win record
   * @returns {number} match win record
   */
  get matchWin () {
    return this._matchWin
  }

  /**
   * Sets the competitor's win
   * @param {number} win the competitor's total wins
   */
  setMatchWin (win) {
    this._matchWin = win
  }

  /**
   * Returns a Competitor's match loss record
   * @returns {number} match loss record
   */
  get matchLoss () {
    return this._matchLoss
  }

  /**
   * Sets the competitor's loss
   * @param {number} loss the competitor's total losses
   */
  setMatchLoss (loss) {
    this._matchLoss = loss
  }

  /**
   * Returns a Competitor's match draw record
   * @returns {number} match draw record
   */
  get matchDraw () {
    return this._matchDraw
  }

  /**
   * Sets the competitor's ties
   * @param {number} draw the competitor's total tiess
   */
  setMatchDraw (draw) {
    this._matchDraw = draw
  }

  /**
   * Returns a Collection of Players for a Competitor
   * @returns {Collection<string, Object} a Competitor's roster
   */
  get players () {
    return this._players
  }

  /**
   * Returns a Collection of social media accounts for a Competitor
   * @returns {Collection<string, Object>} a list of the Competitor's
   * social media accounts.
   */
  get accounts () {
    return this._accounts
  }
}
module.exports = Competitor
