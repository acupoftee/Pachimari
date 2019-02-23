'use strict';

const { Command, PachimariEmbed } = require('../models');
const { CompetitorManager, PlayerManager } = require('../owl_models');
const { EmojiUtil, NumberUtil } = require('../utils');

/**
 * @class PlayerCommand
 * @description represents a command retrieving information about
 * a specific Overwatch League Player
 */
class PlayerCommand extends Command {
     /**
     * Instantiates a new Playerommand
     * @constructor
     */
    constructor() {
        super();
        this.name = 'player';
        this.description = 'Displays information about a specific OWL player';
        this.usage = 'player <player> [accounts]';
        this.aliases = [];
    }

    async execute(client, message, args) {
        if (args.length <= 0) {
            message.channel.send("Please specify an Overwatch League Player to look up");
            return;
        }

        const locateId = PlayerManager.locatePlayer(args[0]);
        const player = PlayerManager.players.get(locateId);

        if (player === undefined) {
            message.channel.send("Could not locate player.");
            return;
        }

        const competitor = CompetitorManager.competitors.get(player.competitorId)
        const embed = new PachimariEmbed(client);
        embed.setColor(competitor.primaryColor);
        embed.setThumbnail(player.headshot);
        if (args[1] === undefined) {
            const teamEmoji = EmojiUtil.getEmoji(client, competitor.abbreviatedName);
            embed.setTitle(`${player.givenName} '**${player.name}**' ${player.familyName}`);
            let info = [];
            info.push(`${teamEmoji} ${EmojiUtil.getEmoji(client, player.role)} **#${player.playerNumber}**`);
            info.push(`${EmojiUtil.getFlag(player.nationality)} ${player.homeLocation}\n`);
            embed.setDescription(info);

            embed.addFields('Eliminations', player.eliminations.toFixed(2), true);
            embed.addFields('Deaths', player.deaths.toFixed(2), true);
            embed.addFields('Hero Damage', player.heroDamage.toFixed(2), true);
            embed.addFields('Healing', player.healing.toFixed(2), true);
            embed.addFields('Ultimates', player.ultimates.toFixed(2), true);
            embed.addFields('Final Blows', player.finalBlows.toFixed(2), true);
            embed.addFields('Time Played', NumberUtil.toTimeString(player.timePlayed), true);
        }
        embed.setFooter("Stats are per 10 minutes, except for Time Played.");
        embed.buildEmbed().post(message.channel);
    }
}
module.exports = PlayerCommand;