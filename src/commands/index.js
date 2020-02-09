'use strict'

const PingCommand = require('./core/utils/PingCommand')
const TeamsCommand = require('./core/team/TeamsCommand')
const TeamCommand = require('./core/team/TeamCommand')
const PlayerCommand = require('./core/player/PlayerCommand')
const TeamcordsCommand = require('./core/team/TeamcordsCommand')
const StandingsCommand = require('./core/match/StandingsCommand')
const NewsCommand = require('./core/news/NewsCommand')
const ScheduleCommand = require('./core/match/ScheduleCommand')
const LiveCommand = require('./core/match/LiveCommand')
const NextCommand = require('./core/match/NextCommand')
const CompareCommand = require('./core/player/CompareCommand')
const HelpCommand = require('./core/utils/HelpCommand')
const PlayersCommand = require('./core/player/PlayersCommand')
const PredictCommand = require('./social/predictions/PredictCommand')
const PredictionsCommand = require('./social/predictions/PredictionsCommand')
const MatchCommand = require('./core/match/MatchCommand')
const SettingsCommand = require('./core/utils/SettingsCommand')
const ProfileCommand = require('./social/profile/ProfileCommand')
const InfoCommand = require('./core/utils/InfoCommand')
const VodCommand = require('./core/vod/VodCommand')
const HypeCommand = require('./social/misc/HypeCommand')
const WambulanceCommad = require('./social/misc/WambulanceCommand')
const TopTenCommand = require('./core/player/TopTenCommand')
const PrideCommand = require('./social/misc/PrideCommand')
const PlaytimeCommand = require('./core/hero/PlaytimeCommand')
const MapCommand = require('./core/team/MapCommand')
const ContendersTeamsCommand = require('./core/contenders/ContendersTeamsCommand')
const ContendersTeamCommand = require('./core/contenders/ContendersTeamCommand')
const GetEmotesCommand = require('./core/utils/GetEmotesCommand')
const ContendersPlayerCommand = require('./core/contenders/ContendersPlayerCommand')
const ContendersScheduleCommand = require('./core/contenders/ContendersScheduleCommand')
const ScheduleCommandv2 = require('./core/match/ScheduleCommandV2')

module.exports = {
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
  PredictCommand,
  PredictionsCommand,
  MatchCommand,
  SettingsCommand,
  ProfileCommand,
  InfoCommand,
  VodCommand,
  HypeCommand,
  WambulanceCommad,
  TopTenCommand,
  PrideCommand,
  PlaytimeCommand,
  MapCommand,
  ContendersTeamsCommand,
  ContendersTeamCommand,
  ContendersPlayerCommand,
  ContendersScheduleCommand,
  GetEmotesCommand,
  ScheduleCommandv2
}
