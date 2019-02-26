'use strict';

const { Command, PachimariEmbed } = require('../models');
const { CompetitorManager, Endpoints, Match } = require('../models/owl_models');
const { EmojiUtil, JsonUtil, MessageUtil, Logger } = require('../utils');
const { LeagueLogo } = require('../constants');
const stageData = require('../data/stages.json');
const moment_timezone = require('moment-timezone');
//const moment = require('moment');

class ScheduleCommand extends Command {
    constructor() {
        super();
        this.name = 'schedule';
        this.description = 'Displays matches for the current state and week';
        this.usage = 'schedule';
        this.aliases = ['matches'];
    }

    async execute(client, message, args) {
        let embed = new PachimariEmbed(client);
        let matches = [];
        let stage_week = "";
        let pages = [];
        let page = 1;

        const body = await JsonUtil.parse(Endpoints.get('SCHEDULE'));
        let promise = new Promise(function(resolve, reject) {
            let currentTime = new Date().getTime();
            let slug = null;
            for (let i = 0; i < stageData.length; i++) {
                const stage = stageData[i];
                if (currentTime > stage.startDate && currentTime < stage.endDate) {
                    slug = stage.slug;
                }
            }
            body.data.stages.forEach(_stage => {
                if (_stage.slug === slug) {
                    _stage.weeks.forEach(week => {
                        if (currentTime > week.startDate && currentTime < week.endDate) {
                            stage_week = `${_stage.name}/${week.name}`
                           // embed.setTitle(`${_stage.name} - ${week.name}`);
                            week.matches.forEach(_match => {
                                let home = CompetitorManager.competitors.get(CompetitorManager.locateTeam(_match.competitors[1].abbreviatedName));
                                let away = CompetitorManager.competitors.get(CompetitorManager.locateTeam(_match.competitors[0].abbreviatedName));
                                let match = new Match(_match.id, (_match.state === 'PENDING') ? true : false,
                                    _match.state, _match.startDate, home, away, _match.scores[1].value, _match.scores[0].value);
                                matches.push(match);
                            });
                        }
                    });
                }
            });
            resolve(1);
        });

        promise.then(function (result) {
            //let numMatches = 4;
            let daysMatch = [];
            for (let i = 0; i <  matches.length; i++) { 
                embed.setTitle(`${stage_week} - ${moment_timezone(matches[i].startDateTS).tz('America/Los_Angeles').format('ddd. MMM Do, YYYY')}`)
                let awayTitle = `${EmojiUtil.getEmoji(client, matches[i].away.abbreviatedName)} **${matches[i].away.name}**`;
                let homeTitle = `**${matches[i].home.name}** ${EmojiUtil.getEmoji(client, matches[i].home.abbreviatedName)}`;
                let pacificTime = moment_timezone(matches[i].startDateTS).tz('America/Los_Angeles').format('h:mm A z');
                let utcTime = moment_timezone(matches[i].startDateTS).utc().format('h:mm A z');
                if (matches[i].pending) {
                    daysMatch.push(`*${pacificTime} / ${utcTime}*\n${awayTitle} vs ${homeTitle}\n`);
                } else {
                    daysMatch.push(`*${pacificTime} / ${utcTime}*\n${awayTitle} ||${matches[i].scoreAway}-${matches[i].scoreHome}|| ${homeTitle}\n`);
                }
            }
            embed.setDescription(daysMatch);
        });
        promise.then(function(result) {
            embed.buildEmbed().post(message.channel);
        });
        promise.catch(function(err) {
            Logger.error(err.stack);
        })
    }
}
module.exports = ScheduleCommand;