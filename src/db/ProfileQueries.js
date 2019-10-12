'use strict'

const Database = require('./Database')
const { Logger } = require('../utils')

class ProfileQueries {
  /**
     * Returns a user's profile
     * @param {number} id a user id
     */
  static getProfile (id) {
    return new Promise(function (resolve, reject) {
      Database.connection.query(
                `SELECT * from profile WHERE user_id=${id}`,
                function (err, rows) {
                  if (err) {
                    Logger.error(`[SQL] Could not SELECT from PROFILE user ${id}`)
                    reject(err)
                  }
                  resolve(rows)
                  Logger.success(`[SQL] SELECT ${id} from PROFILE successful`)
                }
      )
    })
  }

  /**
     * Creates a new profile for a new user.
     * @param {number} user_id
     * @param {number} prediction_score
     * @param {number} server_rank
     * @param {number} global_rank
     * @param {number} num_predictions
     * @param {string} bio
     */
  static createProfile (user_id, prediction_score, server_rank, global_rank, num_predictions, bio) {
    return new Promise(function (resolve, reject) {
      Database.connection.query(
                `INSERT INTO profile (user_id, prediction_score, server_rank, global_rank, num_predictions, bio) VALUES (${
                    user_id}, ${prediction_score}, ${server_rank}, ${global_rank}, ${num_predictions}, '${bio}')`,
                function (err, rows) {
                  if (err) {
                    return Logger.error('[SQL] Could not INSERT into PROFILE' + err.stack)
                  }
                  Logger.success('[SQL] INSERT into PROFILE successful')
                }
      )
    })
  }

  /**
     * Updates a user's bio
     * @param {number} id
     * @param {string} bio
     */
  static updateBio (id, bio) {
    return new Promise(function (resolve, reject) {
      Database.connection.query(
                `UPDATE profile
                 SET bio='${bio}'
                 WHERE user_id=${id}`,
                function (err, rows) {
                  if (err) {
                    return Logger.error(`[SQL] Could not UPDATE ${bio} into PROFILE ${id}`)
                  }
                  Logger.success(`[SQL] UPDATE ${bio} into PROFILE ${id} successful`)
                }
      )
    })
  }
}
module.exports = ProfileQueries
