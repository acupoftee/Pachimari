'use strict';

const { Command, PachimariEmbed } = require('../models');
const { CompetitorManager, Endpoints, Match } = require('../models/owl_models');
const { EmojiUtil, NumberUtil, MessageUtil, JsonUtil, Logger } = require('../utils');
const stageData = require('../data/stages.json');
const moment_timezone = require('moment-timezone');

/**
 * @class TeamCommand
 * @description represents a command retrieving information about
 * a specific Overwatch League Team
 */
class TeamCommand extends Command {

    /**
     * Instantiates a new TeamCommand
     * @constructor
     */
    constructor() {
        super();
        this.name = 'team';
        this.description = 'Displays information about a specific OWL team';
        this.usage = 'team <team> [players|accounts|schedule]';
        this.aliases = [];
    }

    async execute(client, message, args) {
        if (args.length <= 0) {
            message.channel.send("Please specify an Overwatch League Team to look up.");
            return;
        }

        const locateId = CompetitorManager.locateTeam(args[0]);
        const competitor = CompetitorManager.competitors.get(locateId);
        let pages = [];
        let page = 1;

        if (competitor === undefined) {
            MessageUtil.sendError(message.channel, "Could not locate team.");
            return;
        }

        const embed = new PachimariEmbed(client);
        embed.setColor(competitor.primaryColor);
        embed.setThumbnail(competitor.logo);
        const teamEmoji = EmojiUtil.getEmoji(client, competitor.abbreviatedName);
        //embed.setFooter(`Page ${page} of ${pages.length}`);

        if (args[1] === undefined) {
            embed.setTitle(`${teamEmoji} __${
                competitor.name} (${competitor.abbreviatedName})__`);
            let teamInfo = []
            teamInfo.push(competitor.location + ' - ' + CompetitorManager.getDivision(competitor.divisionId).toString() + ' Division');
            teamInfo.push(NumberUtil.ordinal(competitor.placement) + ' in the Overwatch League');

            if (competitor.matchDraw > 0) {
                teamInfo.push('Record: ' + `${competitor.matchWin}-${competitor.matchLoss}-${competitor.matchDraw}\n`);
            } else {
                teamInfo.push('Record: ' + `${competitor.matchWin}-${competitor.matchLoss}`);
            }

            if (competitor.website !== null) {
                embed.addFields('Website', `[Click Here](${competitor.website})`, true);
            }
            let members = [];
            let offense = 0, tanks = 0, supports = 0;
            competitor.players.forEach(player => {
                const countryEmoji = EmojiUtil.getFlag(player.nationality);
                const roleEmoji = EmojiUtil.getEmoji(client, player.role);
                members.push(`${countryEmoji}${roleEmoji} ${player.givenName} '**${player.name}**' ${player.familyName}`);
                if (player.role === 'offense') {
                    offense++;
                } else if (player.role === 'tank') {
                    tanks++;
                } else if (player.role === 'support') {
                    supports++;
                }
            });
            embed.addFields(`${competitor.players.size} Players - ${tanks} tanks, ${offense} offense, ${supports} supports`, members);
            embed.setDescription(teamInfo);
            if (competitor.accounts.size > 0) {
                embed.addFields(`${competitor.accounts.size} Accounts`, `\`\`!team ${args[0]} accounts\`\``, true);
            }
            embed.addFields("Schedule", `\`\`!team ${args[0]} schedule\`\``, true);
            embed.buildEmbed().post(message.channel);
        } else {
            if (args[1].toLowerCase() === 'accounts') {
                if (competitor.accounts.size === 0) {
                    MessageUtil.sendError(message.channel, "This team does not have any accounts.");
                    return;
                }
                let accs = []
                embed.setTitle(`${EmojiUtil.getEmoji(client, competitor.abbreviatedName)} __${competitor.name}'s Accounts__`);
                competitor.accounts.forEach(account => {
                    const accountEmoji = EmojiUtil.getEmoji(client, account.type);
                    accs.push(`${accountEmoji} [${account.type}](${account.url})`);
                });
                let msg = accs.join('\n');
                embed.setDescription(msg);
                embed.buildEmbed().post(message.channel);
            } else if (args[1].toLowerCase() === 'schedule') {
                let matches = [];
                let stage = "";
                const body = await JsonUtil.parse(Endpoints.get('SCHEDULE'));
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
                            stage = _stage.name;
                            //embed.setTitle(`__${teamEmoji} ${body.data.id} ${competitor.name} ${_stage.name} Schedule__`);
                            week.matches.forEach(_match => {
                                if (_match.competitors[0].id == competitor.id || _match.competitors[1].id === competitor.id) {
                                    let home = CompetitorManager.competitors.get(CompetitorManager.locateTeam(_match.competitors[1].abbreviatedName));
                                    let away = CompetitorManager.competitors.get(CompetitorManager.locateTeam(_match.competitors[0].abbreviatedName));
                                    let match = new Match(_match.id, (_match.state === 'PENDING') ? true : false,
                                        _match.state, _match.startDate, home, away, _match.scores[1].value, _match.scores[0].value);
                                    matches.push(match);
                                }
                            })
                        })
                    }
                });

                let daysMatch = [], previousMatches = [];
                matches.forEach(match => {
                    let awayTitle = `${EmojiUtil.getEmoji(client, match.away.abbreviatedName)} **${match.away.name}**`;
                    let homeTitle = `**${match.home.name}** ${EmojiUtil.getEmoji(client, match.home.abbreviatedName)}`;
                    let date = moment_timezone(match.startDateTS).tz('America/Los_Angeles').format('dddd MMM Do');
                    let pacificTime = moment_timezone(match.startDateTS).tz('America/Los_Angeles').format('h:mm A z');
                    let utcTime = moment_timezone(match.startDateTS).utc().format('h:mm A z');
                    if (match.pending) {
                        daysMatch.push(`${date}\n*${pacificTime} / ${utcTime}*\n${awayTitle} vs ${homeTitle}\n`);
                    } else {
                        previousMatches.push(`${date}\n*${pacificTime} / ${utcTime}*\n${awayTitle} ||${match.scoreAway}-${match.scoreHome}|| ${homeTitle}\n`);
                    }
                });
                pages.push(daysMatch);
                pages.push(previousMatches);
                embed.setDescription(pages[page-1]);
                embed.setTitle(`__Upcoming ${stage} Matches for ${competitor.name}__`);
                embed.setFooter(`Page ${page} of ${pages.length}`);
                message.channel.send(embed.buildEmbed().getEmbed).then(msg => {
                    msg.react("🔄").then(r => {
                        const switchFilter = (reaction, user) => reaction.emoji.name === "🔄" && user.id === message.author.id;
                        const refresh = msg.createReactionCollector(switchFilter, { time: 60000 });
                        refresh.on('collect', r => {
                            if (page % 2 == 0) {
                                page--;
                                embed.setTitle(`__Upcoming ${stage} Matches for ${competitor.name}__`);
                            } else {
                                page++;
                                embed.setTitle(`__Previous ${stage} Matches for ${competitor.name}__`);
                            }
                            embed.setDescription(pages[page-1]);
                            embed.setFooter(`Page ${page} of ${pages.length}`);
                            msg.edit(embed.buildEmbed().getEmbed);
                        })
                    })
                });
            }
            else {
                return;
            }
        }
    }
}
module.exports = TeamCommand;