'use strict';
const { Message, TextChannel, GuildMember } = require('discord.js');
const Logger = require('./Logger');

/**
 * Utility class for message handling (send, delete, edit, etc.)
 */
class MessageUtil {
    /**
     * @constructor instantiates a new MessageUtil object
     */
    constructor() {}

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

}
module.exports = MessageUtil;