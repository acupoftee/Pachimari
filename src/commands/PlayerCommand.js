'use strict';

const { Command, PachimariEmbed } = require('../models');
const { CompetitorManager, PlayerManager } = require('../owl_models');
const { EmojiUtil } = require('../utils');

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
            embed.setTitle(`${teamEmoji} ${player.givenName} '**${player.name}**' ${player.familyName}`);
            let info = [];
            info.push(`${EmojiUtil.getFlag(player.nationality)} ${EmojiUtil.getEmoji(client, player.role)}`)
        }
        embed.buildEmbed().post(message.channel);
    }
}
module.exports = PlayerCommand;