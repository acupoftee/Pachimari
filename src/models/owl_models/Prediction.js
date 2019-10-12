'use strict'

/**
 * @class Prediction
 * @description Responsible for storing user predictions
 */
class Prediction {
  /**
     * Responsible for storing user predictions
     * @constructor
     * @param {string} homeTeam
     * @param {number} homeScore
     * @param {string} awayTeam
     * @param {number} awayScore
     * @param {number} matchId
     * @param {string} matchStatus
     */
  constructor (homeTeam, homeScore, awayTeam, awayScore, matchId, matchStatus) {
    this._homeTeam = homeTeam
    this._homeScore = homeScore
    this._awayTeam = awayTeam
    this._awayScore = awayScore
    this._matchId = matchId
    this._matchStatus = matchStatus
  }

  /**
     * Gets the user's home team
     * @returns {string} home team's name
     */
  get homeTeam () {
    return this._homeTeam
  }

  /**
     * Gets the user's home score
     * @returns {number} home team's score
     */
  get homeScore () {
    return this._homeScore
  }

  /**
     * Gets the user's away team
     * @returns {string} awat team's name
     */
  get awayTeam () {
    return this._awayTeam
  }

  /**
     * Gets the user's away score
     * @returns {number} away team's score
     */
  get awayScore () {
    return this._awayScore
  }

  /**
     * Gets the match id of a predicted match
     * @returns {number} match id
     */
  get matchId () {
    return this._matchId
  }

  /**
     * Returns the match's status
     * @returns {string} match status
     */
  get matchStatus () {
    return this._matchStatus
  }
}
module.exports = Prediction
