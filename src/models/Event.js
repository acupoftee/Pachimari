'use strict';

const { Client } = require('discord.js');

/**
 * Super class for Events
 */
class Event {
    /**
     * @constructor
     */
    constructor() {}

    /**
     * Executes an event
     * @param {Client} a Discord bot client 
     */
    execute(client) {}
}
module.exports = Event;