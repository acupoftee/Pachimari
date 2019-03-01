'use strict'

const { PachimariClient } = require('./models');
const { CompetitorManager, PlayerManager } = require('./models/owl_models');
const { Logger } = require('./utils');
const { PingCommand, TeamsCommand, TeamCommand, PlayerCommand,
    TeamcordsCommand, StandingsCommand, NewsCommand, ScheduleCommand, 
    PageCommand, RefreshCommand} = require('./commands');
const { CommandHandler } = require('./events');
const { performance } = require('perf_hooks');

const client = new PachimariClient({
    messageCacheMaxSize: 200,
    messageCacheLifetime: 0,
    messageSweepInterval: 0,
    fetchAllMembers: false
});

let boot;
module.exports = client;
new Promise(function (resolve, reject) {
    boot = performance.now();
    Logger.info('Logging on');
    setTimeout(() => resolve(1), 1);
}).then(function (result) {
    client.runEvent(new CommandHandler());
}).then(function (result) {
    client.addCommand(new PingCommand());
    client.addCommand(new TeamsCommand());
    client.addCommand(new TeamCommand());
    client.addCommand(new PlayerCommand());
    client.addCommand(new TeamcordsCommand());
    client.addCommand(new StandingsCommand());
    client.addCommand(new NewsCommand());
    client.addCommand(new ScheduleCommand());
    client.addCommand(new PageCommand());
    client.addCommand(new RefreshCommand());
}).then(function (result) {
    return new CompetitorManager().getTeams().then(c => c.loadCompetitors()).catch(function (err) {
        Logger.error(err.stack)
    });
}).then(function (result) {
    return new PlayerManager().getPlayers().then(p => p.loadPlayers()).catch(function (err) {
        Logger.error(err.stack)
    });
}).then(function (result) {
    client.login().then(() => {
        Logger.info(`${client.user.tag} is logged in and active. Serving 
        ${client.users.array().length} members. Took ${((performance.now() - boot) / 1000).toFixed(0)} seconds.`);
        client.user.setPresence({
            game: {
                name: `Overwatch League News`
            }
        })
    }).catch(function (err) {
        Logger.error(err.stack)
    });
}).catch(function (err) {
    Logger.error(err.stack)
});
