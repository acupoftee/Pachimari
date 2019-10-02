'use strict'

const Database = require('./Database')
const { Logger } = require('../utils')

class PredictionQueries {
/**
     * Adds a user's prediction in the database
     * @param {string} guild_id
     * @param {string} user
     * @param {string} first_team
     * @param {number} first_score
     * @param {string} second_team
     * @param {number} second_score
     * @param {number} match_id
     * @param {string} match_status
     */
  static addPredictions (guild_id, user, first_team, first_score, second_team, second_score, match_id, match_status) {
    return new Promise(function (resolve, reject) {
      Database.connection.query(
                `INSERT INTO predictions (server_id, user_id, first_team, first_score, second_team, second_score, match_id, match_status) VALUES (${
                    guild_id}, ${user}, "${first_team}", ${first_score}, "${second_team}", ${second_score}, ${match_id}, '${match_status}')`,
                function (err, rows) {
                  if (err) {
                    return Logger.error(`[SQL] Could not INSERT into PREDICTIONS ${
                            guild_id}, ${user}, ${first_team}, ${first_score}, ${second_team}, ${second_score}, ${match_id}, ${match_status}\n${
                                err.stack}`)
                  }
                  Logger.success(`[SQL] INSERT into PREDICTIONS ${
                        guild_id}, ${user}, ${first_team}, ${first_score}, ${second_team}, ${second_score}, ${match_id}, ${match_status} successful`)
                }
      )
    })
  }

  /**
     * Adds a match result in the database
     * @param {string} first_team
     * @param {number} first_score
     * @param {string} second_team
     * @param {number} second_score
     * @param {number} match_id
     * @param {string} match_status
     */
  static addPredictionResults (first_team, first_score, second_team, second_score, match_id, match_status) {
    return new Promise(function (resolve, reject) {
      Database.connection.query(
                `INSERT INTO prediction_results (first_team, first_score, second_team, second_score, match_id, match_status) VALUES ('${
                    first_team}', ${first_score}, '${second_team}', ${second_score}, ${match_id}, '${match_status}')`,
                function (err, rows) {
                  if (err) {
                    return Logger.error(`[SQL] Could not INSERT into PREDICTION RESULTS ${
                            first_team}, ${first_score}, ${second_team}, ${second_score}, ${match_id}, ${match_status}\n${
                                err.stack}`)
                  }
                  Logger.success(`[SQL] INSERT into PREDICTION RESULTS ${
                        first_team}, ${first_score}, ${second_team}, ${second_score}, ${match_id}, ${match_status} successful`)
                }
      )
    })
  }

  /**
     * Returns all user's predictions for the current week
     * @param {number} id user id
     */
  static getPredictions (id) {
    return new Promise(function (resolve, reject) {
      Database.connection.query(
                `SELECT * FROM predictions WHERE user_id = ${id}`,
                function (err, rows) {
                  if (err) {
                    reject(err)
                  }
                  resolve(rows)
                }
      )
    })
  }

  /**
     * Returns a user's specific match prediction for the current week
     * @param {number} id match id
     */
  static getPredicitionBasedOnMatch (id) {
    return new Promise(function (resolve, reject) {
      Database.connection.query(
                `SELECT * FROM predictions WHERE match_id = ${id}`,
                function (err, rows) {
                  if (err) {
                    reject(err)
                  }
                  resolve(rows)
                }
      )
    })
  }

  /**
     * gets predictions based on matches
     * @param {string} firstTeam
     * @param {string} secondTeam
     */
  static getPredicitionBasedOnTeams (firstTeam, secondTeam, userId) {
    return new Promise(function (resolve, reject) {
      Database.connection.query(
                `SELECT * FROM predictions WHERE user_id = ${userId} and ((first_team = '${firstTeam}' and second_team = '${secondTeam}') or (first_team = '${secondTeam}' and second_team = '${firstTeam}'))`,
                function (err, rows) {
                  if (err) {
                    reject(err)
                  }
                  resolve(rows)
                }
      )
    })
  }

  /**
     * Returns an array of distinct matches;
     */
  static getDistinctMatches () {
    return new Promise(function (resolve, reject) {
      Database.connection.query(
        'SELECT DISTINCT match_id FROM predictions',
        function (err, rows) {
          if (err) {
            reject(err)
          }
          resolve(rows)
        }
      )
    })
  }

  /**
     * Deletes predictions with concluded matches from the database
     * @param id match id to delete
     */
  static deletePredictions (id) {
    return new Promise(function (resolve, reject) {
      Database.connection.query(
                `DELETE FROM predictions WHERE match_id=${id}`,
                function (err, rows) {
                  if (err) {
                    return Logger.error(`[SQL] Could not DELETE from PREDICTIONS match_id ${id}`)
                  }
                  Logger.success(`[SQL] DELETE from PREDICTIONS match_id ${id} successful`)
                }
      )
    })
  }
}
module.exports = PredictionQueries
