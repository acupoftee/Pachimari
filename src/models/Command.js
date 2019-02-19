'use strict' 

const {
    Client,
    Message
} = require('discord.js');

/**
 * Super class for all command objects
 */
class Command {

    /**
     * Instantiates a new Command object via subblass
     * @constructor
     */
    constructor() {
        /**
         * Sets the name of the Command
         * @type {String}
         * @public
         */
        this._name = null;
    }

    /**
     * Returns the Command name.
     * @type {String}
     */
    get name() {
        return this._name;
    }

    /**
     * Updates the Command name.
     * @type {String}
     */
    set name(val) {
        this._name = val;
    }

    /**
     * Executes a Command.
     * @param {Client} client a Discord bot client.
     * @param {Message} message a Command origin message
     * @param {String[]} args Arguments for the Command.
     */
    execute(client, message, args) {}
}
module.exports = Command;