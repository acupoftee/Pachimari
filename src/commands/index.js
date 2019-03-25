'use strict';

const PingCommand = require('./core/utils/PingCommand');
const TeamsCommand = require('./core/team/TeamsCommand');
const TeamCommand = require('./core/team/TeamCommand');
const PlayerCommand = require('./core/player/PlayerCommand');
const TeamcordsCommand = require('./core/team/TeamcordsCommand');
const StandingsCommand = require('./core/match/StandingsCommand');
const NewsCommand = require('./core/news/NewsCommand');
const ScheduleCommand = require('./core/match/ScheduleCommand');
const PageCommand = require('./PageCommand');
const RefreshCommand = require('./RefreshCommand');
const LiveCommand = require('./core/match/LiveCommand');
const NextCommand = require('./core/match/NextCommand');
const CompareCommand = require('./core/player/CompareCommand');
const HelpCommand = require('./core/utils/HelpCommand');
const PlayersCommand = require('./core/player/PlayersCommand');
const PredictCommand = require('./social/predictions/PredictCommand');
const PredictionsCommand = require('./social/predictions/PredictionsCommand');
const MatchCommand = require('./core/match/MatchCommand');
const SettingsCommand = require('./core/utils/SettingsCommand');

module.exports = {
    PingCommand,
    TeamsCommand,
    TeamCommand,
    PlayerCommand,
    TeamcordsCommand,
    StandingsCommand,
    NewsCommand,
    ScheduleCommand,
    PageCommand,
    RefreshCommand,
    LiveCommand,
    NextCommand,
    CompareCommand,
    HelpCommand,
    PlayersCommand,
    PredictCommand,
    PredictionsCommand,
    MatchCommand,
    SettingsCommand
};