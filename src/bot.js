'use strict'

const { PachimariClient } = require('./models');
const { CompetitorManager } = require('./owl_models');
const { Logger } = require('./utils');
const { PingCommand, TeamsCommand } = require('./commands');
const { CommandHandler } = require('./events');

const client = new PachimariClient({
    messageCacheMaxSize: 200,
    messageCacheLifetime: 0,
    messageSweepInterval: 0,
    fetchAllMembers: false
});

module.exports = client;
new Promise(function(resolve, reject) {
    Logger.info('Logging on');
    setTimeout(() => resolve(1), 1000);
}).then(function(result) {
    client.runEvent(new CommandHandler());
}).then(function(result) {
    client.addCommand(new PingCommand());
    client.addCommand(new TeamsCommand());
}).then(function(result) {
    return new CompetitorManager().getTeams().then(c => c.loadCompetitors()).catch(Logger.error);
}).then(function(result) {
    client.login().then(() => { 
        Logger.info(`${client.user.tag} is logged in and active. Serving 
        ${client.users.array().length} members.`);
        client.user.setPresence({
            game: {
                name: `Overwatch League News`
            }
        })
    }).catch(Logger.error);
}).catch(Logger.error);
