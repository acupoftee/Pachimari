'use strict';

const { Command, PachimariEmbed } = require('../models');
const { CompetitorManager, Endpoints, Match } = require('../models/owl_models');
const { EmojiUtil, JsonUtil, Logger } = require('../utils');
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
            // if the next match date isn't equal to the current
            // create a new description array
            // push current array into pages
            let daysMatch = [];
            for (let i = 0; i <  matches.length-1; i++) { 
                let title = `${stage_week} - ${moment_timezone(matches[i].startDateTS).tz('America/Los_Angeles').format('ddd. MMM Do, YYYY')}`;
                let awayTitle = `${EmojiUtil.getEmoji(client, matches[i].away.abbreviatedName)} **${matches[i].away.name}**`;
                let homeTitle = `**${matches[i].home.name}** ${EmojiUtil.getEmoji(client, matches[i].home.abbreviatedName)}`;
                let pacificTime = moment_timezone(matches[i].startDateTS).tz('America/Los_Angeles').format('h:mm A z');
                let utcTime = moment_timezone(matches[i].startDateTS).utc().format('h:mm A z');
                if (matches[i].pending) {
                    daysMatch.push(`*${pacificTime} / ${utcTime}*\n${awayTitle} vs ${homeTitle}\n`);
                } else {
                    daysMatch.push(`*${pacificTime} / ${utcTime}*\n${awayTitle} ||${matches[i].scoreAway}-${matches[i].scoreHome}|| ${homeTitle}\n`);
                }
                if (moment_timezone(matches[i].startDateTS).tz('America/Los_Angeles').format('ddd. MMM Do, YYYY') !== moment_timezone(matches[i+1].startDateTS).tz('America/Los_Angeles').format('ddd. MMM Do, YYYY')) {
                    console.log("make new array");
                    pages.push(daysMatch);
                    daysMatch = [];
                    title = `${stage_week} - ${moment_timezone(matches[i+1].startDateTS).tz('America/Los_Angeles').format('ddd. MMM Do, YYYY')}`;
                }
                embed.setTitle(title);
            }
            embed.setDescription(daysMatch);
            embed.setFooter(`Page ${page} of ${pages.length}`);
        });
        promise.then(function(result) {
            let mess = embed.buildEmbed().getEmbed;
            message.channel.send(mess).then(msg => {
                msg.react("⬅").then(r => {
                    msg.react("➡");
    
                    const backwardsFilter = (reaction, user) => reaction.emoji.name === "⬅" && user.id === message.author.id;
                    const forwardFilter = (reaction, user) => reaction.emoji.name === "➡" && user.id === message.author.id;
    
                    const backwards = msg.createReactionCollector(backwardsFilter, { time: 100000 });
                    const forwards = msg.createReactionCollector(forwardFilter, { time: 100000 });
    
                    backwards.on('collect', r => {
                        if (page === 1) return;
                        page--;
                        embed.setDescription(pages[page-1]);
                        embed.setFooter(`Page ${page} of ${pages.length}`);
                        msg.edit(embed.buildEmbed().getEmbed);
                    })
    
                    forwards.on('collect', r => {
                        if (page === pages.length) return;
                        page++;
                        embed.setDescription(pages[page-1]);
                        embed.setFooter(`Page ${page} of ${pages.length}`);
                        msg.edit(embed.buildEmbed().getEmbed);
                    });
                })
            });
        });
        promise.catch(function(err) {
            Logger.error(err.stack);
        })
    }
}
module.exports = ScheduleCommand;