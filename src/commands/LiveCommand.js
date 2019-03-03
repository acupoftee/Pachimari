'use strict';

const { Command, PachimariEmbed } = require('../models');
const { CompetitorManager, Endpoints, Match, Banner } = require('../models/owl_models');
const { JsonUtil, MessageUtil, Logger } = require('../utils');
//const { Emojis } = require('../constants');
//const darklogos = require('../data/darklogos.json')
const moment_timezone = require('moment-timezone');

class LiveCommand extends Command {
    constructor() {
        super();
        this.name = 'live';
        this.description = 'Displays information about a live match';
        this.usage = 'live';
        this.aliases = ['livematch'];
    }

    async execute(client, message, args) {
        const body = await JsonUtil.parse(Endpoints.get('LIVE-MATCH'));
        if (body.data.liveMatch === undefined) {
            MessageUtil.sendError(message.channel, "There's no live match today");
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
        home.secondaryColor, away.secondaryColor, home.logoName, away.logoName);
        
        if (home.abbreviatedName === "HOU") {
            banner.setHomePrimaryColor('#000000');
            banner.setHomeSecondaryColor(home.primaryColor);
        } else if (away.abbreviatedName === "HOU") {
            banner.setAwayPrimaryColor('#000000');
            banner.setAwaySecondaryColor(away.primaryColor);
        }
        banner.buildBanner();
        
        let pacificTime = moment_timezone(match.startDateTS).tz('America/Los_Angeles').format('h:mm A z');
        let utcTime = moment_timezone(match.startDateTS).utc().format('h:mm A z');

        if (match.state === 'IN_PROGRESS') {
            embed.setTitle(`__NOW LIVE: ${moment_timezone(match.startDateTS).tz('America/Los_Angeles').format('ddd. MMM Do, YYYY')}__`);
            embed.setDescription(`*${pacificTime} / ${utcTime}*\n**${match.home.name}** ||${match.scoreHome}-${
                match.scoreAway}|| **${match.away.name}**\n[Watch full match here!](https://overwatchleague.com/en-us/)`);
            embed.setThumbnail("https://cdn.discordapp.com/emojis/551245013938470922.png?v=1");
        } else if (match.pending) {
            embed.setTitle(`__Next Live Match: ${moment_timezone(match.startDateTS).tz('America/Los_Angeles').format('ddd. MMM Do, YYYY')}__`);
            embed.setDescription(`*${pacificTime} / ${utcTime}*\n **${match.home.name}** vs **${
                match.away.name}**`);
        } else {
            MessageUtil.sendSuccess(message.channel, "Check back later for the next match!");
            return;
        }
        embed.setImageFileName('src/res/banner.png', 'banner.png');
        embed.setColor(home.primaryColor);
        embed.buildEmbed().post(message.channel);
        // try {
        //     banner.deleteFile();
        // } catch (error) {
        //     Logger.error(error.stack);
        // }
    }
}
module.exports = LiveCommand;