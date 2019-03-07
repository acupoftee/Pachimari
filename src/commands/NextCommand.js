'use strict';

const { Command, PachimariEmbed } = require('../models');
const { CompetitorManager, Endpoints, Match, Banner } = require('../models/owl_models');
const { JsonUtil, AlertUtil } = require('../utils');
const { Emojis } = require('../constants');
const moment_timezone = require('moment-timezone');

class NextCommand extends Command {
    constructor() {
        super();
        this.name = 'next';
        this.description = 'Displays information about the next live match';
        this.usage = 'next';
        this.aliases = ['nextmatch'];
    }

    async execute(client, message, args) {
        let msg = message.channel.send(Emojis["LOADING"]);
        msg.then(async message => message.edit(await(this.buildMessage(client, message))));
    }

    async buildMessage(client, message) {
        const body = await JsonUtil.parse(Endpoints.get('LIVE-MATCH'));
        if (body.data.nextMatch === undefined || Object.keys(body.data.nextMatch).length === 0) {
            return AlertUtil.ERROR("There's no next match coming up. Check back Later!");
        }

        let live = body.data.nextMatch;
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
       await banner.buildBanner();
        
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
            return AlertUtil.SUCCESS("Check back later for the next match!");
        }
        
        embed.setImageFileName('src/res/banner.png', 'banner.png');
        embed.setColor(home.primaryColor);
        //let mess = embed.buildEmbed().getEmbed;
        embed.buildEmbed();
        return { embed : embed.getEmbed };
        // try {
        //     banner.deleteFile();
        // } catch (error) {
        //     Logger.error(error.stack);
        // }
    }
}
module.exports = NextCommand;