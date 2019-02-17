'use strict'

const PachimariClient = require('./models');
const Logger = require('./utils');

const client = new PachimariClient({
    messageCacheMaxSize: 200,
    messageCacheLifetime: 0,
    messageSweepInterval: 0,
    fetchAllMembers: false
});

module.exports = client;

client.login().then(() => { 
    Logger.info(`${client.user.tag} is logged in and active. Serving 
    ${client.users.array().length} members.`);
    client.users.setPresence({
        game: {
            name: `Overwatch League`
        }
    })
}).catch(error => Logger.error(error));
