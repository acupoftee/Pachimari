'use strict';

const { Command, PachimariEmbed } = require('../models');
const { CompetitorManager } = require('../owl_models');
const { Emojis, Divisions } = require('../constants');
//const divisions = require('../data/divisions.json');

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

    execute(client, message, args) {

        if (args.length <= 0) {
            let teams = [];
            CompetitorManager.competitors.forEach(competitor => {
                teams.push( `${Emojis[`TEAM_${competitor.abbreviatedName.toUpperCase()}`]} ${
                    competitor.name
                  }`);
            });

            // time complexity O(nlogn)
            teams.sort();
            let msg = teams.join('\n');

            const embed = new PachimariEmbed();
            embed.setTitle("Overwatch League Teams");
            embed.setDescription(msg);
            embed.buildEmbed().post(message.channel);
        } else {
            let teams = [];
            Divisions.forEach(division => {
                if (division.values.includes(args[0].toLowerCase())) {
                    CompetitorManager.competitors.forEach(competitor => {
                        if (competitor.divisionId === division.id) {
                            teams.push(`${Emojis[`TEAM_${competitor.abbreviatedName.toUpperCase()}`]} ${competitor.name}`);
                        }
                    });
                    teams.sort();
                    let msg = teams.join('\n');

                    const embed = new PachimariEmbed();
                    embed.setTitle(`${division.title} Teams`);
                    embed.setDescription(msg);
                    embed.buildEmbed().post(message.channel);
                }
            });
        }
    }
}
module.exports = TeamsCommand;