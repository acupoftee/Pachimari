'use strict';

const { Command, PachimariEmbed } = require('../models');
const { CompetitorManager, PlayerManager } = require('../models/owl_models');
const { NumberUtil, MessageUtil, AlertUtil } = require('../utils');
const { Emojis } = require('../constants');

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
        let loading = message.channel.send(Emojis["LOADING"]);
        loading.then(async message => message.edit(await(this.buildMessage(client, args))));
    }

    async buildMessage(client, args) {
        if (args.length <= 0) {
            return AlertUtil.ERROR("Please specify an Overwatch League Player to look up");
        }

        const locateId = PlayerManager.locatePlayer(args[0]);
        const player = PlayerManager.players.get(locateId);

        if (player === undefined) {
            return AlertUtil.ERROR("Could not find player");
        }

        const competitor = CompetitorManager.competitors.get(player.competitorId)
        const embed = new PachimariEmbed(client);
        embed.setColor(competitor.primaryColor);
        embed.setThumbnail(player.headshot);
        const teamEmoji = Emojis[competitor.abbreviatedName];

        // retrieve player data
        if (args[1] === undefined) {
            embed.setTitle(`${player.givenName} '**${player.name}**' ${player.familyName}`);
            let info = [];
            info.push(`${teamEmoji}${Emojis[player.role.toUpperCase()]} **#${player.playerNumber}**`);
            info.push(`${MessageUtil.getFlag(player.nationality)} ${player.homeLocation}`);
            embed.setDescription(info);
            if (player.heroes.length !== 0) {
                embed.addFields('Top Heroes', `${player.heroes.join(', ')}`, true);
            }
            embed.addFields('Time Played', NumberUtil.toTimeString(player.timePlayed), true);
            embed.addFields('Eliminations', player.eliminations.toFixed(2), true);
            embed.addFields('Deaths', player.deaths.toFixed(2), true);
            embed.addFields('Hero Damage', player.heroDamage.toFixed(2), true);
            embed.addFields('Healing', player.healing.toFixed(2), true);
            embed.addFields('Ultimates', player.ultimates.toFixed(2), true);
            embed.addFields('Final Blows', player.finalBlows.toFixed(2), true);
            if (player.accounts.size > 0) {
                embed.addFields(`${player.accounts.size} Accounts`, `\`\`!player ${args[0]} accounts\`\``);
            }            
            embed.setFooter('Stats are per 10 minutes, except for Time Played.');
        } else if (args[1].toLowerCase() === 'accounts') { 

            // return if there are no accounts to be displayed
            if (player.accounts.size === 0) {
                AlertUtil.ERROR("This player does not have any accounts.");
            }
            embed.setTitle(`${teamEmoji} ${player.givenName} '**${player.name}**' ${player.familyName}'s Accounts`);

            let accs = [];
            player.accounts.forEach(account => {
                const accountEmoji = Emojis[account.type.toUpperCase()];
                accs.push(`${accountEmoji} [${account.type}](${account.url})`);
            });
            let msg = accs.join('\n');
            embed.setDescription(msg);
        } else {
            return;
        }
        embed.buildEmbed();
        return { embed : embed.getEmbed };
    }
}
module.exports = PlayerCommand;