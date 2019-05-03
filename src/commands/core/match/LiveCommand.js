'use strict';

const { Command, PachimariEmbed } = require('../../../models');
const { CompetitorManager, Endpoints, Match, Banner, Map, MapManager } = require('../../../models/owl_models');
const { JsonUtil, Logger, AlertUtil } = require('../../../utils');
const { Emojis } = require('../../../constants');
const moment_timezone = require('moment-timezone');

class LiveCommand extends Command {
    constructor() {
        super();
        this.name = 'live';
        this.description = 'Displays information about a live match';
        this.usage = 'live [map|maps]';
        this.aliases = ['livematch'];
    }

    async execute(client, message, args) {
        let loading = message.channel.send(Emojis["LOADING"]);
        const body = await JsonUtil.parse(Endpoints.get('LIVE-MATCH'));
        if (body.data.liveMatch === undefined || Object.keys(body.data.liveMatch).length === 0) {
            loading.then(message => message.edit(AlertUtil.ERROR("There's no live match coming up. Use \`!schedule\` to see when the next match is!")))
            return;
        }

        let live = body.data.liveMatch;
        let embed = new PachimariEmbed(client);
        let home = CompetitorManager.competitors.get(CompetitorManager.locateTeam(live.competitors[0].abbreviatedName));
        let away = CompetitorManager.competitors.get(CompetitorManager.locateTeam(live.competitors[1].abbreviatedName));
        let scoreHome = live.scores[0].value;
        let scoreAway = live.scores[1].value;
        let currentGame, currentMap, currentMapType; //currentIcon;
        let games = live.games.length;

        for (let i = 0; i < live.games.length; i++) {
            if (live.games[i].state === 'IN_PROGRESS' || live.games[i].state === 'PENDING') {
                currentGame = live.games[i].number;
                currentMap = await MapManager.getMap(live.games[i].attributes.mapGuid);
                currentMapType = await MapManager.getMapType(live.games[i].attributes.mapGuid);
                //currentIcon = await MapManager.getMapIcon(live.games[i].attributes.mapGuid);
                break;
            }
        }

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
        let terms = ["maps", "map"];
        let pacificTime = moment_timezone(match.startDateTS).tz('America/Los_Angeles').format('h:mm A z');
        let utcTime = moment_timezone(match.startDateTS).utc().format('h:mm A z');
        if (args[0] === undefined || !terms.includes(args[0].toLowerCase())) {
            Logger.custom(`LIVE_COMMAND`, `Loading live match data.`);
            // sets the following message with a match link if we're live
            if (match.state === 'IN_PROGRESS') {
                embed.setTitle(`__NOW LIVE: ${moment_timezone(match.startDateTS).tz('America/Los_Angeles').format('ddd. MMM Do, YYYY')}__`);
                let description = `*${pacificTime} / ${utcTime}*\n**${match.home.name}** ||${match.scoreHome} - ${
                    match.scoreAway}|| **${match.away.name}**\n Map ${currentGame} of ${games}: ${Emojis[currentMapType.toUpperCase()]} *${
                    currentMap}*\n[Watch full match here!](https://overwatchleague.com/en-us/)`;
                embed.setDescription(description);
                embed.setThumbnail("https://cdn.discordapp.com/emojis/551245013938470922.png?v=1");

            // sets the following message if a match hasn't happened yet
            } else if (match.pending) {
                embed.setTitle(`__${moment_timezone(match.startDateTS).tz('America/Los_Angeles').format('ddd. MMM Do, YYYY')}__`);
                let currentTime = new Date().getTime();
                let description = currentTime < match.startDateTS ? `*${pacificTime} / ${utcTime}*\n ${
                    Emojis[match.home.abbreviatedName.toUpperCase()]} **${match.home.name}** vs **${
                    match.away.name}** ${Emojis[match.away.abbreviatedName.toUpperCase()]}\n*Starts ${moment_timezone(match.startDateTS).endOf('minute').fromNow()}*` :
                    `*${pacificTime} / ${utcTime}*\n ${Emojis[match.home.abbreviatedName.toUpperCase()]} **${match.home.name}** vs **${
                    match.away.name} ${Emojis[match.away.abbreviatedName.toUpperCase()]}**\n[Watch full match here!](https://overwatchleague.com/en-us/)`

                embed.setDescription(description);
                embed.setThumbnail("");
            } else {
                //loading.then(message => message.delete());
                //MessageUtil.sendSuccess(message.channel, `The match between **${home.name}** vs **${away.name}** just finished. Check back later for the next match!`);
                loading.then(message => message.edit(AlertUtil.SUCCESS(`The match between **${home.name}** vs **${away.name}** just finished. Check back later for the next match!`)));
                return;
            }
            const filename = await banner.buildBanner('pic.png');
            embed.setImageFileName(filename, 'pic.png');
            embed.setColor(home.primaryColor);
            loading.then(message => message.delete());
            embed.buildEmbed().post(message.channel);
        } else if (args[0].toLowerCase() === 'map') {
            //loading.then(message => message.delete());
            Logger.custom(`LIVE_COMMAND`, `Loading current live map data.`);
            for (let i = 0; i < live.games.length; i++) {
                if (live.games[i].state === 'IN_PROGRESS') {
                    const mapGuid = live.games[i].attributes.mapGuid;
                    const mapName = await MapManager.getMap(mapGuid);
                    const mapType = await MapManager.getMapType(mapGuid);
                    const mapIcon = await MapManager.getMapIcon(mapGuid);
                    let homeMapScore, awayMapScore;
                    homeMapScore = live.games[i].points === undefined ? 0 : live.games[i].points[0];
                    awayMapScore = live.games[i].points === undefined ? 0 : live.games[i].points[1];
                    let mapStr = `${Emojis[match.home.abbreviatedName.toUpperCase()]}**${match.home.name}** ||${homeMapScore} - ${
                        awayMapScore}|| **${match.away.name}** ${Emojis[match.away.abbreviatedName.toUpperCase()]}\n${
                        Emojis[mapType.toUpperCase()]} *${mapName}:* *${mapType}*\n[Watch full match here!](https://overwatchleague.com/en-us/)`;
                    embed.setThumbnail("https://cdn.discordapp.com/emojis/551245013938470922.png?v=1");
                    embed.setImage(mapIcon);
                    embed.setDescription(mapStr);
                    embed.setColor(home.primaryColor);
                    embed.setTitle(`__NOW LIVE: Current Map for ${moment_timezone(match.startDateTS).tz('America/Los_Angeles').format('ddd. MMM Do, YYYY')}__`);
                    //embed.buildEmbed().post(message.channel);
                    let mess = embed.buildEmbed().getEmbed;
                    loading.then(message => message.edit(mess));
                    return;
                } 
            }
            //MessageUtil.sendError(message.channel, "There is no live game yet. Check back later!");
            loading.then(message => message.edit(AlertUtil.ERROR("There is no live game yet. Check back later!")));
            return;
        } else if (args[0].toLowerCase() === 'maps') {
            Logger.custom(`LIVE_COMMAND MAPS`, `Loading maps for the live match.`);
            if (match.state === 'CONCLUDED') {
                //loading.then(message => message.delete());
                //MessageUtil.sendSuccess(message.channel, `The match between **${home.name}** vs **${away.name}** just finished. Check back later for the next match!`);
                loading.then(message => message.edit(AlertUtil.SUCCESS(`The match between **${home.name}** vs **${away.name}** just finished. Check back later for the next match!`)));
                return;
            }
            let pages = [], icons = [];
            let page = 1, icon = 1;
            for (let i = 0; i < live.games.length; i++) {
                const mapGuid = live.games[i].attributes.mapGuid;
                const mapName = await MapManager.getMap(mapGuid);
                const mapType = await MapManager.getMapType(mapGuid);
                const mapIcon = await MapManager.getMapIcon(mapGuid);
                const mapThumbnail = await MapManager.getMapThumbnail(mapGuid);
                let homeMapScore, awayMapScore;
                let mapStr;
                let map = new Map(mapGuid, mapName, mapIcon, mapThumbnail, mapType, (live.games[i].state === 'PENDING') ? true : false,
                    live.games[i].state)
                if (map.state === 'IN_PROGRESS') {
                    homeMapScore = live.games[i].points === undefined ? 0 : live.games[i].points[0];
                    awayMapScore = live.games[i].points === undefined ? 0 : live.games[i].points[1];
                    mapStr = `**NOW LIVE**\n${Emojis[match.home.abbreviatedName.toUpperCase()]}**${match.home.name}** ||${homeMapScore} - ${
                        awayMapScore}|| **${match.away.name}** ${Emojis[match.away.abbreviatedName.toUpperCase()]}\n${
                        Emojis[mapType.toUpperCase()]} *${mapName}:* *${mapType}*\n[Watch full match here!](https://overwatchleague.com/en-us/)`;
                } else if (map.pending) {
                    mapStr = `*${pacificTime} / ${utcTime}*\n${Emojis[match.home.abbreviatedName.toUpperCase()]} **${match.home.name}** vs **${
                        match.away.name}** ${Emojis[match.away.abbreviatedName.toUpperCase()]}\n${Emojis[mapType.toUpperCase()]} *${map.name}*: *${map.type}*\n`;
                } else {
                    homeMapScore = live.games[i].points[0];
                    awayMapScore = live.games[i].points[1];
                    mapStr = `**Finished Game**\n${Emojis[match.home.abbreviatedName.toUpperCase()]} **${match.home.name}** ||${homeMapScore} - ${
                        awayMapScore}|| **${match.away.name}** ${Emojis[match.away.abbreviatedName.toUpperCase()]}\n${Emojis[mapType.toUpperCase()]} *${mapName}*: *${mapType}*`;
                }
                pages.push(mapStr);
                icons.push(map.icon);
            }
            if (pages.length === 0) {
                //loading.then(message => message.delete());
                //MessageUtil.sendError(message.channel, "Sorry I couldn't find maps for today BUT check back later!");
                loading.then(message => message.edit(AlertUtil.ERROR("Sorry I couldn't find maps for today BUT check back later!")));
                return;
            }
            embed.setDescription(pages[page - 1]);
            embed.setTitle(`__Maps for Live Match: ${moment_timezone(match.startDateTS).tz('America/Los_Angeles').format('ddd. MMM Do, YYYY')}__`);
            embed.setThumbnail("");
            embed.setImage(icons[icon - 1]);
            embed.setColor(home.primaryColor);
            embed.setFooter(`Page ${page} of ${pages.length}. Only command author can turn pages`);
            let mess = embed.buildEmbed().getEmbed;
           // loading.then(message => message.delete());
           loading.then(message => message.edit(mess)).then(msg => {
                msg.react("⬅").then(r => {
                    msg.react("➡");

                    const backwardsFilter = (reaction, user) => reaction.emoji.name === "⬅" && user.id === message.author.id;
                    const forwardFilter = (reaction, user) => reaction.emoji.name === "➡" && user.id === message.author.id;

                    const backwards = msg.createReactionCollector(backwardsFilter, { time: 100000 });
                    const forwards = msg.createReactionCollector(forwardFilter, { time: 100000 }); // { time: 100000 }
                    backwards.on('collect', async r => {
                        if (page === 1) {
                            await r.remove(message.author.id);
                            return;
                        }
                        page--;
                        icon--;
                        embed.setDescription(pages[page - 1]);
                        embed.setImage(icons[icon - 1]);
                        embed.setFooter(`Page ${page} of ${pages.length}. Only command author can turn pages`);
                        await r.remove(message.author.id);
                        msg.edit(embed.buildEmbed().getEmbed);
                    })

                    forwards.on('collect', async r => {
                        if (page === pages.length) {
                            await r.remove(message.author.id);
                            return;
                        }
                        page++;
                        icon++;
                        embed.setDescription(pages[page - 1]);
                        embed.setImage(icons[icon - 1]);
                        embed.setFooter(`Page ${page} of ${pages.length}. Only command author can turn pages`);
                        await r.remove(message.author.id);
                        msg.edit(embed.buildEmbed().getEmbed);
                    });
                })
            });
        }
    }
}
module.exports = LiveCommand;