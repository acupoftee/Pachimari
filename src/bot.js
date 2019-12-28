'use strict'

const pckg = require('../package.json')
const mongoose = require('mongoose')
const { PachimariClient } = require('./models')
// const Database = require('./db/Database')
const { CompetitorManager, PlayerManager } = require('./models/owl_models')
const { HeroWatcher, PlayerStatsWatcher, RosterWatcher } = require('./watchers')
const { Logger } = require('./utils')
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
  // PredictCommand,
  // PredictionsCommand,
  MatchCommand,
  SettingsCommand,
  // ProfileCommand,
  InfoCommand,
  VodCommand,
  HypeCommand,
  WambulanceCommad,
  TopTenCommand,
  PrideCommand,
  PlaytimeCommand
  // MapCommand
} = require('./commands')
const { CommandHandler } = require('./events')
// const { CommandHandler } = require('./events')
// const Twitch = require('./social/Twitch')
// const Tweets = require('./social/Tweets')
const { performance } = require('perf_hooks')
const express = require('express')
const app = express()

const client = new PachimariClient({
  messageCacheMaxSize: 200,
  messageCacheLifetime: 0,
  messageSweepInterval: 0,
  fetchAllMembers: false
})

let boot
module.exports = client
new Promise(function (resolve, reject) {
  boot = performance.now()
  Logger.info('Logging on')
  setTimeout(() => resolve(1), 1)
}).then(function () {
  // return new Database()
  //   .init()
  //   .then(db => db.connect())
  //   .catch(function (err) {
  //     Logger.error(err.stack)
  //   })
  mongoose.connect('mongodb://localhost:27017/pachimari', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  }, err => {
    if (err) return console.error(err)
    console.log('Connected to PachiDB')
  })
}).then(function (result) {
  client.runEvents(new CommandHandler())
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
    // new PredictCommand(),
    // new PredictionsCommand(),
    new MatchCommand(),
    new SettingsCommand(),
    // new ProfileCommand()
    new InfoCommand(),
    new VodCommand(),
    new HypeCommand(),
    new WambulanceCommad(),
    new TopTenCommand(),
    new PrideCommand(),
    new PlaytimeCommand()
    // new MapCommand()
  )
}).then(function (result) {
  return new CompetitorManager().getTeams().then(c => c.loadCompetitors()).catch(function (err) {
    Logger.error(err.stack)
  })
}).then(function (result) {
  return new PlayerManager().getPlayers().then(p => p.loadPlayers()).catch(function (err) {
    Logger.error(err.stack)
  })
}).then(function (result) {
  return new HeroWatcher().watchForHeroUpdates()
}).then(function (result) {
  return new PlayerStatsWatcher().watchForPlayerStatUpdates()
}).then(function (result) {
  return new RosterWatcher().watchForTeamSwaps()

  // // }).then(function(result) {
  //     return new PredictionManager().watch();
  // }).then(function(result) {
  //     return new Twitch(client).watch();
  // }).then(function(result) {
  //     return new Tweets(client).watch();
}).then(function (result) {
  client.login().then(() => {
    Logger.info(`${client.user.tag} is logged in and active. Serving
        ${client.users.array().length} members. Took ${((performance.now() - boot) / 1000).toFixed(0)} seconds.`)
    client.user.setPresence({
      game: {
        name: `v${pckg.version} - !help <3`
      }
    })
    app.listen(process.env.PORT || 3000)
  }).catch(function (err) {
    Logger.error(err.stack)
  })
}).catch(function (err) {
  Logger.error(err.stack)
})
