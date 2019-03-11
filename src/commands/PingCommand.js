'use strict';

const { Command } = require('../models');
const { Logger } = require('../utils');
const { PingGifs } = require('../constants');
const fs = require('fs');

/**
 * A basic command in which Pachimari will 
 * ping the User who invokes the command.
 * @extends {Command}
 */
class PingCommand extends Command {
    constructor() {
        super();
        this.name = 'ping';
        this.description = 'pings the bot to check timing';
        this.usage = 'ping';
        this.aliases = ['pong'];
    }

    execute(client, message, args) {
        message.channel.send(':ping_pong: Pinging...').then(m => {
            m.edit(`:ping_pong: \`\`${client.ping} ms\`\``).then(msg => {
                let rand = Math.floor(Math.random() * PingGifs.LINKS.length-1) + 1;
                message.channel.send(PingGifs.LINKS[rand]);
            });
        }).catch(Logger.error);
    }
}
module.exports = PingCommand;