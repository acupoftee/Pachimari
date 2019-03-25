'use strict';

const { Command, PachimariEmbed } = require('../../../models');
const { CompetitorManager, Endpoints, Match, Banner } = require('../../../models/owl_models');
const { JsonUtil, AlertUtil, MessageUtil } = require('../../../utils');
const { Emojis } = require('../../../constants');
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
        let loading = message.channel.send(Emojis["LOADING"]);
        const body = await JsonUtil.parse(Endpoints.get('LIVE-MATCH'));
        if (body.data.nextMatch === undefined || Object.keys(body.data.nextMatch).length === 0) {
            loading.then(message => message.delete());
            MessageUtil.sendError(message.channel, "There's no next match available yet. Check back Later!");
            return;
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
        
        let pacificTime = moment_timezone(match.startDateTS).tz('America/Los_Angeles').format('h:mm A z');
        let utcTime = moment_timezone(match.startDateTS).utc().format('h:mm A z');

        if (match.pending) {
            embed.setTitle(`__Next Live Match: ${moment_timezone(match.startDateTS).tz('America/Los_Angeles').format('ddd. MMM Do, YYYY')}__`);
            let description = `*${pacificTime} / ${utcTime}*\n ${Emojis[match.home.abbreviatedName.toUpperCase()]} **${match.home.name}** vs **${
                match.away.name}** ${Emojis[match.away.abbreviatedName.toUpperCase()]}`

            embed.setDescription(description);
            embed.setThumbnail("");
        } else {
            return AlertUtil.SUCCESS("Check back later for the next match!");
        }
        
        const filename = await banner.buildBanner('next.png');
        embed.setImageFileName(filename, 'next.png');
        embed.setColor(home.primaryColor);

        loading.then(message => message.delete());
        embed.buildEmbed().post(message.channel);
    }
}
module.exports = NextCommand;