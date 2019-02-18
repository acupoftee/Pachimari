'use strict'
const { Message } = require('discord.js');
const Logger = require('./Logger');
// send, and delete either bot or author

/**
 * Utility class for message handling (send, delete, edit, etc.)
 */
class MesageUtil {
    /**
     * @constructor instantiates a new MessageUtil object
     */
    constructor() {}

    /**
		 * Send a message from the bot.
		 * Then delete the bot's message, author's message, or both.
		 * @param {String} message Message to send from the bot.
		 * @param {Message} sent_message Message sent by the author.
		 * @param {boolean} [delete_bot=false] Flag to determine deleting of the bot's message.
		 * @param {boolean} [delete_author=true] Flag to determine deleting of the author's message.
		 * @param {number} [timeout=5] Delay in seconds for deleting the message.
		 */
    static sendMessage(messsage, sent_message, delete_bot=false, delete_author=true, timeout=5) {
        sent_message.channel.send().then(m => {
            if (sent_message.channel.type === 'text') {
                if (delete_bot) {
                    m.delete(timeout * 1000);
                } 
                if (delete_author) {
                    sent_message.delete(timeout * 1000);
                }
            }
        }).catch(Logger.error);
    }
}