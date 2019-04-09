'use strict';
const { Command, PachimariEmbed } = require('../../../models');
const { MessageUtil } = require('../../../utils');
const { Emojis } = require('../../../constants');
const Queries = require('../../../db/Queries');

class ProfileCommand extends Command {
    constructor() {
        super();
        this.name = "profile";
        this.description = "displays a member's statistics";
        this.usage = "profile";
        this.aliases = [];
    }

    async execute(client, message, args) {
        const id = message.author.id;
        let predictionScore = 0, serverRank = 0, globalRank = 0, numPredictions = 0, bio = "Hi notice me senpai!"
        let embed = new PachimariEmbed(client);
        let profile = await Queries.getProfile(id);
        if (Object.keys(profile).length === 0) {
            await Queries.createProfile(id, predictionScore, serverRank, globalRank, numPredictions, bio);
            profile = await Queries.getProfile(id);
        }
        embed.setThumbnail(message.author.avatarURL)
        embed.setTitle(message.author.username);
        embed.addFields('Bio', profile[0].bio);
        embed.addFields(':trophy: Server Rank', `#${profile[0].server_rank}`);
        embed.addFields(':earth_africa: Global Rank', `#${profile[0].global_rank}`);
        embed.buildEmbed().post(message.channel);
    }
}
module.exports = ProfileCommand;