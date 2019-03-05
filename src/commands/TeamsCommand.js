'use strict';

const { Command, PachimariEmbed } = require('../models');
const { CompetitorManager } = require('../models/owl_models');
const { Emojis } = require('../constants');
const { AlertUtil } = require('../utils');
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

    async execute(client, message, args) {
        let msg = message.channel.send(Emojis["LOADING"]);
        msg.then(async message => message.edit(await(this.buildMessage(client, args))));
    }
    async buildMessage(client, args) {
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
            embed.buildEmbed();
            return { embed : embed.getEmbed };
        } else {
            let teams = [];
            let run = false;
            let div;
            divisions.forEach(division => {
                if (division.values.includes(args[0].toLowerCase())) {
                    run = true;
                    div = division;
                }
            });

            if (run) {
                const embed = new PachimariEmbed(client);
                CompetitorManager.competitors.forEach(competitor => {
                    if (competitor.divisionId === div.id) {
                        teams.push(`${
                            Emojis[competitor.abbreviatedName]} ${
                                competitor.name}`
                        );
                    }
                });

                teams.sort();
                   
                embed.setTitle(`__${div.title} Teams__`);
                embed.setDescription(teams);
                embed.buildEmbed();

                return { embed : embed.getEmbed };
            } else {
                return AlertUtil.ERROR("Could not find division.");
            }

        }
    }
}
module.exports = TeamsCommand;
