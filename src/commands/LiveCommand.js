'use strict';

const { Command, PachimariEmbed } = require('../models');
const { CompetitorManager, Endpoints, Match, Banner, Map, MapManager} = require('../models/owl_models');
const { JsonUtil, AlertUtil, MessageUtil, Logger } = require('../utils');
const { Emojis } = require('../constants');
const moment_timezone = require('moment-timezone');

class LiveCommand extends Command {
    constructor() {
        super();
        this.name = 'live';
        this.description = 'Displays information about a live match';
        this.usage = 'live [maps]';
        this.aliases = ['livematch'];
    }

    async execute(client, message, args) {
        let loading = message.channel.send(Emojis["LOADING"]);
        //msg.then(async message => message.edit(await(this.buildMessage(client, message))));
        const body = await JsonUtil.parse(Endpoints.get('LIVE-MATCH'));
        if (body.data.liveMatch === undefined || Object.keys(body.data.liveMatch).length === 0) {
            MessageUtil.sendError(message.channel, "There's no live match coming up. Check back Later!");
            return;
        }

        let live = body.data.liveMatch;
        let embed = new PachimariEmbed(client);
        let home = CompetitorManager.competitors.get(CompetitorManager.locateTeam(live.competitors[0].abbreviatedName));
        let away = CompetitorManager.competitors.get(CompetitorManager.locateTeam(live.competitors[1].abbreviatedName));
        let scoreHome = live.scores[0].value;
        let scoreAway = live.scores[1].value;

        let match = new Match(live.id, (live.state === 'PENDING') ? true : false, live.state,
            live.startDateTS, home, away, scoreHome, scoreAway);

        let banner = new Banner(home.primaryColor, away.primaryColor,
            live.competitors[0].secondaryColor, live.competitors[1].secondaryColor, home.logoName, away.logoName);

        if (home.abbreviatedName === "HOU") {
            banner.setHomePrimaryColor('#000000');
            banner.setHomeSecondaryColor(home.primaryColor);
        } else if (away.abbreviatedName === "HOU") {
            banner.setAwayPrimaryColor('#000000');
            banner.setAwaySecondaryColor(away.primaryColor);
        }

        let pacificTime = moment_timezone(match.startDateTS).tz('America/Los_Angeles').format('h:mm A z');
        let utcTime = moment_timezone(match.startDateTS).utc().format('h:mm A z');
        if (args[0] === undefined) {
            if (match.state === 'IN_PROGRESS') {
                embed.setTitle(`__NOW LIVE: ${moment_timezone(match.startDateTS).tz('America/Los_Angeles').format('ddd. MMM Do, YYYY')}__`);
                let description = `*${pacificTime} / ${utcTime}*\n**${match.home.name}** ||${match.scoreHome}-${
                    match.scoreAway}|| **${match.away.name}**\n[Watch full match here!](https://overwatchleague.com/en-us/)`;
                embed.setDescription(description);
                embed.setThumbnail("https://cdn.discordapp.com/emojis/551245013938470922.png?v=1");
            } else if (match.pending) {
                embed.setTitle(`__Next Live Match: ${moment_timezone(match.startDateTS).tz('America/Los_Angeles').format('ddd. MMM Do, YYYY')}__`);
                let currentTime = new Date().getTime();
                let description = currentTime < match.startDateTS ? `*${pacificTime} / ${utcTime}*\n **${match.home.name}** vs **${
                    match.away.name}**\n*Starts ${moment_timezone(match.startDateTS).endOf('minute').fromNow()}*` :
                    `*${pacificTime} / ${utcTime}*\n **${match.home.name}** vs **${
                    match.away.name}**\n[Watch full match here!](https://overwatchleague.com/en-us/)`

                embed.setDescription(description);
            } else {
                loading.then(message => message.delete());
                MessageUtil.sendSuccess(message.channel, `The match between **${home.name}** vs **${away.name}** just finished. Check back later for the next match!`);
                return;
            }
            const filename = await banner.buildBanner('pic.png');
            embed.setImageFileName(filename, 'pic.png');
            embed.setColor(home.primaryColor);
            embed.setThumbnail("");
            loading.then(message => message.delete());
            embed.buildEmbed().post(message.channel);
        } else if (args[0].toLowerCase() === 'maps') {
            if (match.state === 'CONCLUDED') {
                loading.then(message => message.delete());
                MessageUtil.sendSuccess(message.channel, `The match between **${home.name}** vs **${away.name}** just finished. Check back later for the next match!`);
                return;
            }
            let maps = [];
            for (let i = 0; i < live.games.length; i++) {
                const map = await MapManager.getMap(live.games[i].attributes.mapGuid);
                const mapType = await MapManager.getMapType(live.games[i].attributes.mapGuid);
                let mapStr;
                if (live.games[i].state !== 'PENDING') {
                    embed.setTitle(`__NOW LIVE: Maps for ${moment_timezone(match.startDateTS).tz('America/Los_Angeles').format('ddd. MMM Do, YYYY')}__`);
                    const homeMapScore = live.games[i].points[0];
                    const awayMapScore = live.games[i].points[1];
                    
                    mapStr = `***${map}***: *${mapType}*\n**${match.home.name}** ||${homeMapScore}-${
                        awayMapScore}|| **${match.away.name}**\n`;
                    maps.push(mapStr);
                } else {
                    embed.setTitle(`__Maps for Next Live Match: ${moment_timezone(match.startDateTS).tz('America/Los_Angeles').format('ddd. MMM Do, YYYY')}__`);
                    //mapStr = `***${map}***: *${mapType}*\n`;
                    embed.addFields(`${Emojis[mapType.toUpperCase()]} ${map}`, `${mapType}`, true);
                }
            }
            embed.setDescription(maps);
        }
    }
}
module.exports = LiveCommand;