'use strict';

const { Command } = require('../models');
const { CompetitorManager } = require('../owl_models');
const { Emojis } = require('../constants');

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
        this.name = "teams";
    }

    execute(client, message, args) {
        let teams = [];
        CompetitorManager.competitors.forEach(competitor => {
            teams.push(`${Emojis[`TEAM_${competitor.abbreviatedName.toUpperCase()}`]} ${competitor.name}`);
        });

        // time complexity O(nlogn)
        teams.sort();
        message.channel.send(teams.join('/n'));
    }
}
module.exports = TeamsCommand;