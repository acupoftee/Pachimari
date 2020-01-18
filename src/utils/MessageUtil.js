'use strict'
// const { Message, TextChannel, GuildMember } = require('discord.js')
const Logger = require('./Logger')

/**
 * Utility class for message handling (send, delete, edit, etc.)
 */
class MessageUtil {
  /**
     * Sends a message from Pachimari bot.
     * Then delete the bot's message, author's message, or both if specified
     * @param {String} message Message to send from the bot.
     * @param {Message} sentMessage Message sent by the author.
     * @param {boolean} [deleteBot=false] Flag to determine deleting of the bot's message.
     * @param {boolean} [deleteAuthor=true] Flag to determine deleting of the author's message.
     * @param {number} [timeout=5] Delay in seconds for deleting the message.
     */
  static sendMessage (message, sentMessage, deleteBot = false, deleteAuthor = true, timeout = 5) {
    sentMessage.channel.send(message).then(m => {
      if (sentMessage.channel.type === 'text') {
        if (deleteBot) {
          m.delete(timeout * 1000)
        }
        if (deleteAuthor) {
          sentMessage.delete(timeout * 1000)
        }
      }
    }).catch(function (err) {
      Logger.error(err.stack)
    })
  }

  /**
     * Capitalizes the first letter in a message
     * @param {string} message
     * @returns {string} a string with a capitalized letter
     */
  static capitalize (message) {
    return message.charAt(0).toUpperCase() + message.slice(1)
  }

  /**
     * Capitalizes the first letter of each word in a sentence
     * @param {string} sentence
     */
  static capitalizeSentence (sentence) {
    const str = sentence.toLowerCase().split(' ')
    for (let i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].substring(1)
    }
    return str.join(' ')
  }

  /**
     * Sends a success message to the user
     * @param {TextChannel|GuildMember} destination channel to send the message
     * @param {string} message sucess message
     */
  static sendSuccess (destination, message) {
    destination.send(`:white_check_mark: ${message}`)
  }

  /**
     * Sends an error message to the user
     * @param {TextChannel|GuildMember} destination channel to send the message
     * @param {string} message error message
     */
  static sendError (destination, message) {
    destination.send(`:x: ${message}`)
  }

  /**
     * Sends a message to the specified announcement channel
     * @param {TextChannel|GuildMember} destination channel to send the message
     * @param {string} message error message
     */
  static sendLive (destination, message) {
    destination.send(message)
  }

  /**
     * Returns a country's flag as an emoji
     * @param {string} countryCode ISO 3166-1 country code.
     * @returns {string} country emoji
     */
  static getFlag (countryCode) {
    if (countryCode) {
      return `:flag_${countryCode === 'TPE' ? 'tw' : countryCode.toLowerCase()}:`
    }
    return ':united_nations:'
  }
}
module.exports = MessageUtil
