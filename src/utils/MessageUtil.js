'use strict';
const { Message, TextChannel, GuildMember } = require('discord.js');
const Logger = require('./Logger');

/**
 * Utility class for message handling (send, delete, edit, etc.)
 */
class MessageUtil {
    /**
		 * Sends a message from Pachimari bot.
		 * Then delete the bot's message, author's message, or both if specified
		 * @param {String} message Message to send from the bot.
		 * @param {Message} sent_message Message sent by the author.
		 * @param {boolean} [delete_bot=false] Flag to determine deleting of the bot's message.
		 * @param {boolean} [delete_author=true] Flag to determine deleting of the author's message.
		 * @param {number} [timeout=5] Delay in seconds for deleting the message.
		 */
    static sendMessage(message, sent_message, delete_bot=false, delete_author=true, timeout=5) {
        sent_message.channel.send(message).then(m => {
            if (sent_message.channel.type === 'text') {
                if (delete_bot) {
                    m.delete(timeout * 1000);
                } 
                if (delete_author) {
                    sent_message.delete(timeout * 1000);
                }
            }
        }).catch(function (err) {
            Logger.error(err.stack);
        });
    }
    
    /**
     * Capitalizes the first letter in a message
     * @param {string} message 
     * @returns {string} a string with a capitalized letter
     */
    static capitalize(message) {
        return message.charAt(0).toUpperCase() + message.slice(1);
    }

    /**
     * Capitalizes the first letter of each word in a sentence
     * @param {string} sentence 
     */
    static capitalizeSentence(sentence) {
        let str = sentence.toLowerCase().split(" ");
        for (let i = 0; i < str.length; i++) {
            str[i] = str[i].charAt(0).toUpperCase() + str[i].substring(1);
        }
        return str.join(" ");
    }

    /**
     * Sends a success message to the user
     * @param {TextChannel|GuildMember} destination channel to send the message
     * @param {string} message sucess message
     */
    static sendSuccess(destination, message) {
        destination.send(`:white_check_mark: ${message}`);
    }

     /**
     * Sends an error message to the user
     * @param {TextChannel|GuildMember} destination channel to send the message
     * @param {string} message error message
     */
    static sendError(destination, message) {
        destination.send(`:x: ${message}`);
    }

    /**
     * Sends a message to the specified announcement channel
     * @param {TextChannel|GuildMember} destination channel to send the message
     * @param {string} message error message
     */
    static sendLive(destination, message) {
        destination.send(message);
    }

     /**
     * Returns a country's flag as an emoji
     * @param {string} countryCode ISO 3166-1 country code.
     * @returns {string} country emoji
     */
    static getFlag(countryCode) {
        if (countryCode) {
            return `:flag_${countryCode.toLowerCase()}:`;
        }
        return ':flag_white:';
    }

}
module.exports = MessageUtil;