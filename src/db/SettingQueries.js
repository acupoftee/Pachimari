'use strict'

const Database = require('./Database')
const { Logger } = require('../utils')
// const { TextChannel } = require(
//   'discord.js'
// )

class SettingsQueries {
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
}
module.exports = SettingsQueries
