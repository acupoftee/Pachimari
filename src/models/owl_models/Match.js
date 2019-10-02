'use strict'

/**
 * @class Match
 * @descriptions represents an Overwatch League Match object
 */
class Match {
  /**
     * Instantiates a new Match object
     * @constructor
     * @param {number} id match ID
     * @param {boolean} pending indicates if a matches is pending or not
     * @param {string} state the current state of a match
     * @param {number} startDateTS the start date of a match
     * @param {string} home the home team
     * @param {string} away the away team
     * @param {number} scoreHome home team score
     * @param {number} scoreAway away team score
     */
  constructor (id, pending, state, startDateTS, home, away, scoreHome, scoreAway) {
    this._id = id
    this._pending = pending
    this._state = state
    this._startDateTS = startDateTS
    this._home = home
    this._away = away
    this._scoreHome = scoreHome
    this._scoreAway = scoreAway
  }

  /**
     * Returns the match id
     * @returns {number} match id
     */
  get id () {
    return this._id
  }

  /**
     * Returns true if a match is pending
     * @returns {boolean} true if a match is pending
     */
  get pending () {
    return this._pending
  }

  /**
     * Returns the current state of a match
     * @returns {string} the state of a match
     */
  get state () {
    return this._state
  }

  /**
     * Returns a matches start date timestamp
     * @returns {number} start date time stamp
     */
  get startDateTS () {
    return this._startDateTS
  }

  /**
     * Returns the name of the home team
     * @returns {string} home team name
     */
  get home () {
    return this._home
  }

  /**
     * Returns the name of the away team
     * @returns {string} away team name
     */
  get away () {
    return this._away
  }

  /**
     * Returns the home team's score
     * @returns {number} home team score
     */
  get scoreHome () {
    return this._scoreHome
  }

  /**
     * Returns the away team's score
     * @returns {number} away team score
     */
  get scoreAway () {
    return this._scoreAway
  }
}
module.exports = Match
