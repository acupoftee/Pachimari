'use strict';

const { Command } = require('../models');
const { Logger, EmojiUtil} = require('../utils');

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
            m.edit(`:ping_pong: \`\`${client.ping} ms\`\``);
        }).catch(Logger.error);
    }
}
module.exports = PingCommand;