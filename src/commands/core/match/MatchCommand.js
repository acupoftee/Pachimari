'use strict';

const { Command, PachimariEmbed } = require('../../../models');
const { CompetitorManager, Endpoints, MapManager } = require('../../../models/owl_models');
const { JsonUtil, MessageUtil } = require('../../../utils');
const { Emojis } = require('../../../constants');
const moment_timezone = require('moment-timezone');

class MatchCommand extends Command {
    constructor() {
        super();
        this.name = 'matches';
        this.description = 'Displays information about team matches';
        this.usage = 'matches <first_team> [second_team]';
        this.aliases = [];
    }
    async execute(client, message, args) {
        let stage_week = "";
        let loading = message.channel.send(Emojis["LOADING"]);
        let pages = [], matches = [], titles = [], futureMatches = [];
        let page = 1, title = 1;
        let header;
        let found = false, concluded = false, pending = true;
        let embed = new PachimariEmbed(client);

        if (args.length < 1 || args.length > 2) {
            loading.then(message => message.delete());
            MessageUtil.sendError(message.channel, "Sorry, I couldn't find matches :C Make sure to add two!");
            return;
        } else if (args.length == 1) {
            let firstTeam = CompetitorManager.competitors.get(CompetitorManager.locateTeam(args[0]));
            if (firstTeam === undefined) {
                loading.then(message => message.delete());
                MessageUtil.sendError(message.channel, "Could not locate team.");
                return;
            }
            embed.setTitle(`${Emojis[firstTeam.abbreviatedName.toUpperCase()]} ${firstTeam.name} Matches`);
            embed.setColor(firstTeam.primaryColor);
            embed.setThumbnail(firstTeam.logo);
            const body = await JsonUtil.parse(Endpoints.get("SCHEDULE"));
            for (const _stage of body.data.stages) {
                for (const week of _stage.weeks) {
                    stage_week = `${_stage.name} - ${week.name}`;
                    for (const _match of week.matches) {
                        let home = CompetitorManager.competitors.get(CompetitorManager.locateTeam(_match.competitors[0].abbreviatedName));
                        let away = CompetitorManager.competitors.get(CompetitorManager.locateTeam(_match.competitors[1].abbreviatedName));
                        let homeMatchScore = _match.scores[0].value;
                        let awayMatchScore = _match.scores[1].value;
                        if ((home.id === firstTeam.id) || ((away.id === firstTeam.id))) {
                            found = true;
                            if (_match.status === "CONCLUDED") {
                                for (let i = 0; i < _match.games.length; i++) {
                                    const mapGuid = _match.games[i].attributes.mapGuid;
                                    const mapName = await MapManager.getMap(mapGuid);
                                    const mapType = await MapManager.getMapType(mapGuid);
                                    let homeMapScore = _match.games[i].points === undefined ? 0 : _match.games[i].points[0];
                                    let awayMapScore = _match.games[i].points === undefined ? 0 : _match.games[i].points[1];
                                    let mapStr = `${Emojis[mapType.toUpperCase()]} ${mapName}: ${mapType}\n${
                                        Emojis[home.abbreviatedName.toUpperCase()]} ${homeMapScore} - ${awayMapScore} ${
                                        Emojis[away.abbreviatedName.toUpperCase()]}\n`
                                    if (i == 0) {
                                        let title = `${Emojis[home.abbreviatedName.toUpperCase()]} __${home.name} vs. ${away.name}__ ${Emojis[away.abbreviatedName.toUpperCase()]}`;
                                        titles.push(title);
                                        header = `Match Date: ${moment_timezone(_match.startDateTS).tz('America/Los_Angeles').format('dddd. MMM Do, YYYY')}
                                        ${stage_week}\n
                                        Match Score:\n${Emojis[home.abbreviatedName.toUpperCase()]} ${homeMatchScore} - ${
                                            awayMatchScore} ${Emojis[away.abbreviatedName.toUpperCase()]}\n\n__**Maps**__\n`;
                                        mapStr = header + mapStr;
                                    }
                                    matches.push(mapStr);
                                    pending = false;
                                }
                            } else {
                                header = `${Emojis[home.abbreviatedName.toUpperCase()]} **${home.name} vs. ${away.name}** ${Emojis[away.abbreviatedName.toUpperCase()]}
                                Match Date: ${moment_timezone(_match.startDateTS).tz('America/Los_Angeles').format('dddd. MMM Do, YYYY')}\n${stage_week}\n`;
                                futureMatches.push(header);
                                pending = true;
                            }
                        }
                        if (matches.length > 0) {
                            pages.push(matches);
                            matches = [];
                        }
                    }
                }
                if (pending) {
                    let title = `__Upcoming ${firstTeam.name} ${_stage.name} Matches__`;
                    titles.push(title);
                }
                if (futureMatches.length > 0) {
                    pages.push(futureMatches);
                    futureMatches = [];
                }
            }
        } else if (CompetitorManager.locateTeam(args[0]) === CompetitorManager.locateTeam(args[1])) {
            loading.then(message => message.delete());
            MessageUtil.sendError(message.channel, ":C Make sure to use two different teams!");
            return;
         } else {
            let firstTeam = CompetitorManager.competitors.get(CompetitorManager.locateTeam(args[0]));
            let secondTeam = CompetitorManager.competitors.get(CompetitorManager.locateTeam(args[1]));

            if (firstTeam === undefined || secondTeam === undefined) {
                loading.then(message => message.delete());
                MessageUtil.sendError(message.channel, "Could not locate team.");
                return;
            }
            embed.setTitle(`${Emojis[firstTeam.abbreviatedName.toUpperCase()]} ${firstTeam.name} vs ${secondTeam.name} ${Emojis[secondTeam.abbreviatedName.toUpperCase()]}`);
            embed.setColor(firstTeam.primaryColor);
            embed.setThumbnail(firstTeam.logo);
            const body = await JsonUtil.parse(Endpoints.get("SCHEDULE"));
            for (const _stage of body.data.stages) {

                for (const week of _stage.weeks) {
                    stage_week = `${_stage.name} - ${week.name}`;
                    for (const _match of week.matches) {
                        let home = CompetitorManager.competitors.get(CompetitorManager.locateTeam(_match.competitors[0].abbreviatedName));
                        let away = CompetitorManager.competitors.get(CompetitorManager.locateTeam(_match.competitors[1].abbreviatedName));
                        let homeMatchScore = _match.scores[0].value;
                        let awayMatchScore = _match.scores[1].value;
                        if (((home.id === firstTeam.id) && (away.id === secondTeam.id)) || ((away.id === firstTeam.id) && (home.id === secondTeam.id))) {
                            found = true;
                            if (_match.status === "CONCLUDED") {
                                for (let i = 0; i < _match.games.length; i++) {
                                    const mapGuid = _match.games[i].attributes.mapGuid;
                                    const mapName = await MapManager.getMap(mapGuid);
                                    const mapType = await MapManager.getMapType(mapGuid);
                                    let homeMapScore = _match.games[i].points === undefined ? 0 : _match.games[i].points[0];
                                    let awayMapScore = _match.games[i].points === undefined ? 0 : _match.games[i].points[1];
                                    let mapStr = `${Emojis[mapType.toUpperCase()]} ${mapName}: ${mapType}\n${
                                        Emojis[home.abbreviatedName.toUpperCase()]} ${homeMapScore} - ${awayMapScore} ${
                                        Emojis[away.abbreviatedName.toUpperCase()]}\n`
                                    if (i == 0) {
                                        let title = `${Emojis[home.abbreviatedName.toUpperCase()]} __${home.name} vs. ${away.name}__ ${Emojis[away.abbreviatedName.toUpperCase()]}`;
                                        titles.push(title);
                                        header = `Match Date: ${moment_timezone(_match.startDateTS).tz('America/Los_Angeles').format('dddd. MMM Do, YYYY')}
                                            ${stage_week}\n
                                            Match Score:\n${Emojis[home.abbreviatedName.toUpperCase()]} ${homeMatchScore} - ${
                                            awayMatchScore} ${Emojis[away.abbreviatedName.toUpperCase()]}\n\n__**Maps**__\n`;
                                        mapStr = header + mapStr;
                                    }
                                    matches.push(mapStr);
                                }
                            } else {
                                let title = `${Emojis[home.abbreviatedName.toUpperCase()]} __${home.name} vs. ${away.name}__ ${Emojis[away.abbreviatedName.toUpperCase()]}`;
                                titles.push(title);
                                let header = `Match Date: ${moment_timezone(_match.startDateTS).tz('America/Los_Angeles').format('dddd. MMM Do, YYYY')}\n${stage_week}`;
                                matches.push(header);
                            }
                        }
                    }
                    if (matches.length > 0) {
                        pages.push(matches);
                        matches = [];
                    }
                }
            }
        }

        if (!found) {
            loading.then(message => message.delete());
            MessageUtil.sendError(message.channel, "Sorry, I couldn't find that match :C");
        }
        loading.then(message => message.delete());
        embed.setDescription(pages[page - 1]);
        embed.setTitle(titles[title - 1]);
        console.log(titles);

        if (pages.length > 1) {
            embed.setFooter(`Page ${page} of ${pages.length}`);
            let mess = embed.buildEmbed().getEmbed;
            message.channel.send(mess).then(msg => {
                msg.react("⬅").then(r => {
                    msg.react("➡");

                    const backwardsFilter = (reaction, user) => reaction.emoji.name === "⬅" && user.id === message.author.id;
                    const forwardFilter = (reaction, user) => reaction.emoji.name === "➡" && user.id === message.author.id;

                    const backwards = msg.createReactionCollector(backwardsFilter);
                    const forwards = msg.createReactionCollector(forwardFilter); // { time: 100000 }

                    backwards.on('collect', async r => {
                        if (page === 1) {
                            await r.remove(message.author.id);
                            return;
                        }
                        page--;
                        if (args.length === 1) {
                            title--;
                            embed.setTitle(titles[title - 1]);
                        }
                        embed.setDescription(pages[page - 1]);
                        embed.setFooter(`Page ${page} of ${pages.length}`);
                        await r.remove(message.author.id);
                        msg.edit(embed.buildEmbed().getEmbed);
                    })

                    forwards.on('collect', async r => {
                        if (page === pages.length) {
                            await r.remove(message.author.id);
                            return;
                        }
                        page++;
                        if (args.length === 1) {
                            title++;
                            embed.setTitle(titles[title - 1]);
                        }
                        embed.setDescription(pages[page - 1]);
                        embed.setFooter(`Page ${page} of ${pages.length}`);
                        await r.remove(message.author.id);
                        msg.edit(embed.buildEmbed().getEmbed);
                    });
                })
            });
        } else {
            embed.buildEmbed().post(message.channel);
        }
    }
}
module.exports = MatchCommand;