'use strict'

const Database = require('./Database')
const { Logger } = require('../utils')
const { TextChannel } = require(
  'discord.js'
)

class Queries {
  /**
     * Adds a guild into the database
     * @param {number} id
     */
  static addGuild (id) {
    return new Promise(function (resolve, reject) {
      Database.connection.query(
                `INSERT INTO guilds (server_id) VALUES (${id})`,
                function (err, rows) {
                  if (err) {
                    return Logger.error(`[SQL] Could not INSERT into GUILD ${id}`)
                  }
                  Logger.success(`[SQL] INSERT into GUILD ${id} successful`)
                }
      )
    })
  }

  /**
     * Deletes a guild from the database
     * @param {number} id
     */
  static deleteGuild (id) {
    return new Promise(function (resolve, reject) {
      Database.connection.query(
                `DELETE FROM guilds WHERE server_id = ${id}`,
                function (err, rows) {
                  if (err) {
                    return Logger.error(`[SQL] Could not DELETE from GUILD ${id}`)
                  }
                  Logger.success(`[SQL] DELETE from GUILD ${id} successful`)
                }
      )
    })
  }

  /**
     * Returns a guild's information
     * @param {number} id
     */
  static getGuild (id) {
    return new Promise(function (resolve, reject) {
      Database.connection.query(
                `SELECT * FROM guilds WHERE server_id = ${id}`,
                function (err, rows) {
                  if (err) {
                    reject(err)
                  }
                  resolve(rows[0])
                }
      )
    })
  }

  static getOwlAnnounceChannels () {
    return new Promise(function (resolve, reject) {
      Database.connection.query(
        'SELECT * FROM guilds WHERE announce_owl = \'true\'',
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
     * Updates the command prefix for a specific server
     * @param {number} id
     * @param {string} commandPrefix
     */
  static updatePrefix (id, commandPrefix) {
    return new Promise(function (resolve, reject) {
      Database.connection.query(
                `UPDATE guilds
                 SET prefix='${commandPrefix}'
                 WHERE server_id=${id}`,
                function (err, rows) {
                  if (err) {
                    return Logger.error(`[SQL] Could not UPDATE ${commandPrefix} into GUILD ${id}`)
                  }
                  Logger.success(`[SQL] UPDATE ${commandPrefix} into GUILD ${id} successful`)
                }
      )
    })
  }

  /**
     * Updates the overwatch announcement boolean
     * for a specific server
     * @param {number} id
     * @param {string} announce
     */
  static updateOwlAnnouncement (id, announce) {
    return new Promise(function (resolve, reject) {
      Database.connection.query(
                `UPDATE guilds
                 SET announce_owl='${announce}'
                 WHERE server_id=${id}`,
                function (err, rows) {
                  if (err) {
                    return Logger.error(`[SQL] Could not UPDATE ${announce} into GUILD ${id}`)
                  }
                  Logger.success(`[SQL] UPDATE ${announce} into GUILD ${id} successful`)
                }
      )
    })
  }

  /**
     * Updates the overwatch announcement channel
     * for a specific server
     * @param {number} id
     * @param {TextChannel} channel
     */
  static updateOwlAnnouncementChannel (id, channel) {
    const channelId = channel.replace(/\D/g, '')
    return new Promise(function (resolve, reject) {
      Database.connection.query(
                `UPDATE guilds
                 SET announce_owl_channel='${channelId}'
                 WHERE server_id=${id}`,
                function (err, rows) {
                  if (err) {
                    return Logger.error(`[SQL] Could not UPDATE ${channelId} into GUILD ${id}`)
                  }
                  Logger.success(`[SQL] UPDATE ${channelId} into GUILD ${id} successful`)
                }
      )
    })
  }

  /**
     * Updates the overwatch twitter boolean
     * for a specific server
     * @param {number} id
     * @param {string} announce
     */
  static updateOwlTwitter (id, announce) {
    return new Promise(function (resolve, reject) {
      Database.connection.query(
                `UPDATE guilds
                 SET owl_twitter='${announce}'
                 WHERE server_id=${id}`,
                function (err, rows) {
                  if (err) {
                    return Logger.error(`[SQL] Could not UPDATE ${announce} into GUILD ${id}`)
                  }
                  Logger.success(`[SQL] UPDATE ${announce} into GUILD ${id} successful`)
                }
      )
    })
  }

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
}
module.exports = Queries
