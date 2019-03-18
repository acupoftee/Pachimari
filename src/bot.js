'use strict'

const { PachimariClient } = require('./models');
const { CompetitorManager, PlayerManager } = require('./models/owl_models');
const { Logger } = require('./utils');
const { PingCommand, TeamsCommand, TeamCommand, PlayerCommand,
    TeamcordsCommand, StandingsCommand, NewsCommand, ScheduleCommand, 
    LiveCommand, NextCommand, CompareCommand } = require('./commands');
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
    client.addCommands(
        new TeamsCommand(),
        new TeamCommand(),
        new PlayerCommand(),
        new TeamcordsCommand(),
        new StandingsCommand(),
        new NewsCommand(),
        new ScheduleCommand(),
        new LiveCommand(),
        new NextCommand(),
        new PingCommand(),
        new CompareCommand()
    );
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
