'use strict';

const { Command, PachimariEmbed } = require('../models');
const { CompetitorManager } = require('../owl_models');
const { EmojiUtil, Logger } = require('../utils');
const discordServers = require('../data/discords.json');
/**
 * @class TeamcordsCommand
 * @description represents a command retrieving all 
 * Overwatch League Team discords
 */
class TeamcordsCommand extends Command {
    /**
     * Instantiates a new TeamcordsCommand
     * @constructor
     */
    constructor() {
        super();
        this.name = 'teamcords';
        this.description = 'Displays Discord servers for OWL teams';
        this.usage = 'teamcords [division|team]';
        this.aliases = [];
    }

    // O(n*d) time. Optimize?
    async execute(client, message, args) {
        if (args.length <= 0) {
            let discords = [];
            CompetitorManager.competitors.forEach(competitor => {
                const teamEmoji = EmojiUtil.getEmoji(client, competitor.abbreviatedName);
                let discord = CompetitorManager.locateAccount(competitor, "DISCORD");
                if (discord === undefined) {
                    for (let i = 0; i < discordServers.length; i++) {
                        let server = discordServers[i];
                        if (server.team == competitor.name) {
                            discord = server.url;
                        }
                    }
                } 
                discords.push(`${teamEmoji}[${competitor.name}](${discord})`);
             });
            discords.sort();
            let msg = discords.join('\n');
            const embed = new PachimariEmbed(client);
            embed.setTitle("Overwatch League Team Discords");
            embed.setThumbnail('https://cdn.discordapp.com/emojis/549030645226143757.png?v=1');
            embed.setColor('#7289DA');
            embed.setDescription(msg);
            embed.buildEmbed().post(message.channel);
        }
    }
}
module.exports = TeamcordsCommand;