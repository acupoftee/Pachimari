'use strict'

const { PachimariClient } = require('./models');
const Database = require('./db/Database');
const { CompetitorManager, PlayerManager } = require('./models/owl_models');
const { Logger } = require('./utils');
const { 
    PingCommand, 
    TeamsCommand, 
    TeamCommand, 
    PlayerCommand,
    TeamcordsCommand, 
    StandingsCommand, 
    NewsCommand, 
    ScheduleCommand, 
    LiveCommand, 
    NextCommand, 
    CompareCommand, 
    HelpCommand, 
    PlayersCommand,
    PredictCommand
 } = require('./commands');
const { CommandHandler, GuildEvent } = require('./events');
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
}).then(function() {
    return new Database()
        .init()
        .then(db => db.connect())
        .catch(function(err) {
            Logger.error(err.stack);
        });
}).then(function (result) {
    client.runEvents(new CommandHandler(), new GuildEvent());
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
        new CompareCommand(),
        new HelpCommand(),
        new PlayersCommand(),
        new PredictCommand()
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
