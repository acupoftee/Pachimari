'use strict'

const { PachimariClient } = require('./models');
const { Logger } = require('./utils');
const { PingCommand } = require('./commands');
const { CommandHandler } = require('./events');

const client = new PachimariClient({
    messageCacheMaxSize: 200,
    messageCacheLifetime: 0,
    messageSweepInterval: 0,
    fetchAllMembers: false
});

module.exports = client;

client.addCommand(new PingCommand());

client.runEvent(new CommandHandler());

client.login().then(() => { 
    Logger.info(`${client.user.tag} is logged in and active. Serving 
    ${client.users.array().length} members.`);
    client.user.setPresence({
        game: {
            name: `Overwatch League News`
        }
    })
}).catch(error => Logger.error(error));
