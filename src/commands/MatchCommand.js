'use strict';

const { Command, PachimariEmbed } = require('../models');
const { CompetitorManager, Endpoints, Match, Map, MapManager } = require('../models/owl_models');
const { JsonUtil, MessageUtil } = require('../utils');
const { Emojis } = require('../constants');
const moment_timezone = require('moment-timezone');

class MatchCommand extends Command {
    constructor() {
        super();
        this.name = 'match';
        this.description = 'Displays information about a past match';
        this.usage = 'match <first_team> <second_team>';
        this.aliases = [];
    }
    async execute(client, message, args) {
        let stage_week = "";
        //let loading = message.channel.send(Emojis["LOADING"]);
        message.channel.startTyping();
        let pages = [], matches = [];
        let page = 1;
        let header;
        let found = false;

        let firstTeam = CompetitorManager.competitors.get(CompetitorManager.locateTeam(args[0]));
        let secondTeam = CompetitorManager.competitors.get(CompetitorManager.locateTeam(args[1]));

        let embed = new PachimariEmbed(client);
        embed.setTitle(`${Emojis[firstTeam.abbreviatedName.toUpperCase()]} ${firstTeam.name} vs ${secondTeam.name} ${Emojis[secondTeam.abbreviatedName.toUpperCase()]}`);
        const body = await JsonUtil.parse(Endpoints.get("SCHEDULE"));
        for (const _stage of body.data.stages) {
            for (const week of _stage.weeks) {
                stage_week = `${_stage.name}/${week.name}`;
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
                                    Emojis[away.abbreviatedName.toUpperCase()]}`
                                if (i == 0) {
                                    header = `Match Date: ${moment_timezone(_match.startDateTS).tz('America/Los_Angeles').format('dddd. MMM Do, YYYY')}
                                        ${stage_week}\n
                                        Match Score: ${Emojis[home.abbreviatedName.toUpperCase()]} ${homeMatchScore} - ${
                                        awayMatchScore} ${Emojis[away.abbreviatedName.toUpperCase()]}\n`;
                                    mapStr = header + mapStr;
                                }
                                matches.push(mapStr);
                            }
                        } else {
                            let header = `Match Date: ${moment_timezone(_match.startDateTS).tz('America/Los_Angeles').format('dddd. MMM Do, YYYY')}\n${stage_week}`;
                            matches.push(header);
                        }
                    }
                }
            }
            if (matches.length > 0) {
                pages.push(matches);
                matches = [];
            }
        }
        if (!found) {
            message.channel.stopTyping();
            MessageUtil.sendError(message.channel, "Sorry, I couldn't find that match :C");
        }
        message.channel.stopTyping();
        embed.setDescription(pages[page - 1]);

        if (pages.length > 1) {
            let mess = embed.buildEmbed().getEmbed;
            message.channel.send(mess).then(msg => {
                msg.react("⬅").then(r => {
                    msg.react("➡");

                    const backwardsFilter = (reaction, user) => reaction.emoji.name === "⬅" && user.id === message.author.id;
                    const forwardFilter = (reaction, user) => reaction.emoji.name === "➡" && user.id === message.author.id;

                    const backwards = msg.createReactionCollector(backwardsFilter);
                    const forwards = msg.createReactionCollector(forwardFilter); // { time: 100000 }

                    backwards.on('collect', r => {
                        if (page === 1) return;
                        page--;
                        embed.setDescription(pages[page - 1]);
                        msg.edit(embed.buildEmbed().getEmbed);
                    })

                    forwards.on('collect', r => {
                        if (page === pages.length) return;
                        page++;
                        embed.setDescription(pages[page - 1]);
                        msg.edit(embed.buildEmbed().getEmbed);
                    });
                })
            });
        } else {
            embed.buildEmbed().post(message.channel);
        }
    }
}
module.exports = MatchCommand