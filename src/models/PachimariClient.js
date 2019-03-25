'use strict'

require('dotenv').config()

const { Client, Collection } = require('discord.js');
const { Command, Event } = require('../models');
const { Logger } = require('../utils');

/**
 * Entry point for Pachimari Client
 * @extends {Client}
 */
class PachimariClient extends Client {

    /**
     * @constructor
     * @param {Object} [options] Options for defining the client
     */
    constructor(options = {}) {
        super(options);

        /**
         * A Collection of Pachimari's Commands
         * @type {Collection<String, Command>} a Collection with a command name and Command
         */
        this.commands = new Collection();

        /**
         * Prefix for commands.
         * @type {String}
         */
        this.prefix = "!";
    }

    /**
     * Logs bot into Discord using a
     * generated token from the Discord Developer portal.
     * @returns {Promise<string>}
     */
    login() {
        return super.login(process.env.TOKEN);
    }

    /**
     * Adds a Command to the Pachimari Client
     * @param {Command} command a Discord Command Object
     */
    addCommand(command) {
        this.commands.set(command.name, command);
        Logger.success(`Loaded command ${command.name.toUpperCase()}`);
    }

    /**
      * Adds a list of commands to the Pachimari Client
      * @param {Command[]} command an array of Discord Command Objects
      */
    addCommands(...commands) {
        commands.forEach(command => {
            this.commands.set(command.name, command);
            Logger.success(`Loaded command ${command.name.toUpperCase()}`);
        });
    }

    /**
     * Starts an Event execution
     * @param {Event[]} events Discord Events
     */
    runEvents(...events) {
        events.forEach(event => {
            event.execute(this);
            Logger.success(`Loaded event ${event.constructor.name}`);
        });
    }
}
module.exports = PachimariClient;

