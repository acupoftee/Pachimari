'use strict';

const { Command, PachimariEmbed } = require('../models');
const { CompetitorManager } = require('../models/owl_models');
const { EmojiUtil } = require('../utils');
const { Emojis } = require('../constants');
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
                teams.push( `${ Emojis[competitor.abbreviatedName]} ${
                    competitor.name}`
                  );
            });

            teams.sort();
            const embed = new PachimariEmbed(client);
            embed.setTitle("__Overwatch League Teams__");
            embed.setDescription(teams);
            embed.buildEmbed().post(message.channel);
        } else {
            let teams = [];
            divisions.forEach(division => {
                if (division.values.includes(args[0].toLowerCase())) {
                    CompetitorManager.competitors.forEach(competitor => {
                        if (competitor.divisionId === division.id) {
                            teams.push(`${
                                Emojis[competitor.abbreviatedName]} ${
                                    competitor.name}`
                            );
                        }
                    });
                    teams.sort();
                    const embed = new PachimariEmbed(client);
                    embed.setTitle(`__${division.title} Teams__`);
                    embed.setDescription(teams);
                    embed.buildEmbed().post(message.channel);
                }
            });
        }
    }
}
module.exports = TeamsCommand;