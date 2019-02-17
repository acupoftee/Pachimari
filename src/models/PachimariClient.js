'use strict'

require('dotenv').config()

const { Client } = require('discord.js');

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
    }

    /**
     * Logs bot into Discord using a
     * generated token from the Discord Developer portal.
     */
    login() {
        return super.login(process.env.TOKEN);
    }
}
module.exports = PachimariClient;