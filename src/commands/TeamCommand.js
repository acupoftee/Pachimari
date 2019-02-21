'use strict';

const { Command, PachimariEmbed, Emojis } = require('../models');
const { CompetitorManager } = require('../owl_models');

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
        const competitor = null;
        CompetitorManager.competitors.forEach(competitor => {});

        const embed = new PachimariEmbed(client);
        embed.setColor('#fff'); //TODO set to primary color
        embed.setTitle('EMOJI TEAM_NAME');
        embed.setDescription('LOCATION');
        embed.buildEmbed().post(message.channel);
    }
}
module.exports = TeamCommand;