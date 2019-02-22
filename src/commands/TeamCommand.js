'use strict';

const { Command, PachimariEmbed } = require('../models');
const { CompetitorManager } = require('../owl_models');
const { EmojiUtil, NumberUtil } = require('../utils');

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
            message.channel.send("Could not locate team.");
            return;
        }

        const embed = new PachimariEmbed(client);
        embed.setColor(competitor.primaryColor);
        embed.setThumbnail(competitor.logo);

        if (args[1] === undefined) {
            embed.setTitle(`${EmojiUtil.getEmoji(client, competitor.abbreviatedName.toLowerCase())} ${
                competitor.name}`);
            embed.setDescription(competitor.location + ' - ' + CompetitorManager.getDivision(competitor.divisionId).toString() + ' Division');
            if (competitor.website !== null) {
                embed.addFields('Website', `[Click Here](${competitor.website})`);
            }
            embed.addFields('Standing', NumberUtil.ordinal(competitor.placement), true);
            embed.addFields('W-L-T', `${competitor.matchWin}-${competitor.matchLoss}-${competitor.matchDraw}`, true);
            embed.addFields(`Players (${competitor.players.size})`, `\`\`!team ${args[0]} players\`\``);
            embed.addFields(`Accounts (${competitor.accounts.size})`, `\`\`!team ${args[0]} accounts\`\``);
        } else {
            if (args[1].toLowerCase() === 'players') {
                let offense = 0, tanks = 0, supports = 0;
                embed.setTitle(`${EmojiUtil.getEmoji(client, competitor.abbreviatedName.toLowerCase())} ${competitor.name} Players`);
                competitor.players.forEach(player => {
                    const roleEmoji = EmojiUtil.getEmoji(client, player.role.toLowerCase());
                    embed.addFields(`${roleEmoji} ${player.name}`, `${player.fullName}`, true);

                    if (player.role === 'offense') {
                        offense++;
                    } else if (player.role === 'tank') {
                        tanks++;
                    } else if (player.role === 'support') {
                        supports++;
                    }
                });
                embed.setDescription(`${tanks} tanks, ${offense} offense, ${supports} support`);
            } else if (args[1].toLowerCase() === 'accounts') {
                embed.setTitle(`${EmojiUtil.getEmoji(client, competitor.abbreviatedName.toLowerCase())} ${competitor.name} Accounts`);
                competitor.accounts.forEach(account => {
                    const accountEmoji = EmojiUtil.getEmoji(client, account.type.toLowerCase());
                    embed.addFields(`${accountEmoji} ${account.type}`, `[Click here](${account.url} '${account.url}')`);

                });
            }
        }
        embed.buildEmbed().post(message.channel);
    }
}
module.exports = TeamCommand;