'use strict';
require('dotenv').config();

const { Event } = require('../models');
const { Logger } = require('../utils');
const Queries = require('../db/Queries');

/**
 * Responsible for handling various Pachimari Commands
 * @extends {Event}
 */
class CommandHandler extends Event {

    /**
     * Instantiates a new CommandHandler for handling varous Pachimari Commands
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Executes a command based on the command parsed in the 
     * Message content.
     * @param {Client} client a Discord bot Client
     */
    async execute(client) {
        client.on('message', async message => {
            if ((await Queries.getGuild(message.guild.id)) === undefined) {
                await Queries.addGuild(message.guild.id);
            }
            
            const row = await Queries.getGuild(message.guild.id);
            const prefix = row.prefix;
            if (!message.content.startsWith(prefix) || message.author.bot) {
                return;
            }
            if (message.channel.type !== 'text') {
                return;
            }

            // https://anidiots.guide/first-bot/command-with-arguments
            const args = message.content.slice(prefix.length).trim().split(/ +/g);
            const commandName = args.shift().toLowerCase();
            const command = client.commands.get(commandName);

            if (!command) {
                return;
            }
            try {
                client.commands.get(command.name).execute(client, message, args);
            } catch (error) {
                Logger.error(error);
            }
        });
    }
}
module.exports = CommandHandler;