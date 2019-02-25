'use strict';

const { Command, PachimariEmbed } = require('../models');
const { CompetitorManager } = require('../models/owl_models');
const { EmojiUtil, NumberUtil, MessageUtil } = require('../utils');

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
        

        if (competitor === undefined) {
            MessageUtil.sendError(message.channel, "Could not locate team.");
            return;
        }

        const embed = new PachimariEmbed(client);
        embed.setColor(competitor.primaryColor);
        embed.setThumbnail(competitor.logo);

        if (args[1] === undefined) {
            const teamEmoji = EmojiUtil.getEmoji(client, competitor.abbreviatedName);
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
            if (competitor.accounts.size > 0) {
                embed.addFields(`${competitor.accounts.size} Accounts`, `\`\`!team ${args[0]} accounts\`\``);
            }
            embed.setDescription(teamInfo);
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
            }
            else {
                return;
            }
        }
        embed.buildEmbed().post(message.channel);
    }
}
module.exports = TeamCommand;