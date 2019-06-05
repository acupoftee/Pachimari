'use strict';

const Account = require('./Account');
const Player = require('./Player');
const Competitor = require('./Competitor');
const CompetitorManager = require('../managers/CompetitorManager');
const Endpoints = require('./Endpoints');
const PlayerManager = require('../managers/PlayerManager');
const Article = require('./Article');
const Match = require('./Match');
const StandingsManager = require('../managers/StandingsManager');
const Banner = require('./Banner');
const MapManager = require('../managers/MapManager');
const Map = require('./Map');
const PredictionManager = require('../managers/PredictionManager');
const MatchManager = require('../managers/MatchManager');
const Video = require('./Video');
const HeroManager = require('../managers/HeroManager');
const HypeGif = require('../gif_models/HypeGif');
const Hero = require('./Hero')
const WambulanceGif = require('../gif_models/WambulanceGif');
const PrideGif = require('../gif_models/PrideGif');

module.exports = {
    Account,
    Player, 
    Competitor,
    CompetitorManager,
    Endpoints,
    PlayerManager,
    Article,
    Match,
    StandingsManager,
    Banner,
    MapManager,
    Map,
    PredictionManager,
    MatchManager,
    Video,
    HeroManager,
    HypeGif,
    Hero,
    WambulanceGif,
    PrideGif
};