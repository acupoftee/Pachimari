'use strict';

const { Command, PachimariEmbed } = require('../models');
const { CompetitorManager } = require('../owl_models');
const { EmojiUtil } = require('../utils');
const divisions = require('../data/divisions.json');

/**
 * @class TeamsCommand
 * @description represents a command that lists all Competitors
 * in the Overwatch League
 */
class TeamsCommand extends Command {
    /**
     * Instantiates a new TeamsComamand
     * @constructor
     */
    constructor() {
        super();
        this.name = 'teams';
        this.description = 'Lists all Overwatch League teams';
        this.usage = 'teams [division]';
        this.aliases = [];

    }

    /**
     * 
     * @param {Client} client 
     * @param {string} message 
     * @param {string[]} args 
     */
    async execute(client, message, args) {
        if (args.length <= 0) {
            let teams = [];
            CompetitorManager.competitors.forEach(competitor => {
                teams.push( `${ EmojiUtil.getEmoji(client, competitor.abbreviatedName)} ${
                    competitor.name}`
                  );
            });

            let msg = teams;
            const embed = new PachimariEmbed(client);
            embed.setTitle("Overwatch League Teams");
            embed.setDescription(msg);
            embed.setThumbnail("https://image.redbull.com/rbcom/010/2016-11-07/1331828036498_2/0010/1/1500/1000/1/the-overwatch-league-logo-is-an-instant-classic.png");
            embed.buildEmbed().post(message.channel);
        } else {
            let teams = [];
            divisions.forEach(division => {
                if (division.values.includes(args[0].toLowerCase())) {
                    CompetitorManager.competitors.forEach(competitor => {
                        if (competitor.divisionId === division.id) {
                            teams.push(`${
                                EmojiUtil.getEmoji(client, competitor.abbreviatedName)} ${
                                    competitor.name}`
                            );
                        }
                    });
                    let msg = teams.join('\n');
                    const embed = new PachimariEmbed(client);
                    embed.setTitle(`${division.title} Teams`);
                    embed.setDescription(msg);
                    embed.setThumbnail("https://image.redbull.com/rbcom/010/2016-11-07/1331828036498_2/0010/1/1500/1000/1/the-overwatch-league-logo-is-an-instant-classic.png");
                    embed.buildEmbed().post(message.channel);
                }
            });
        }
    }
}
module.exports = TeamsCommand;