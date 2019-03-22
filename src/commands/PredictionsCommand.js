const { Command, Prediction, PachimariEmbed } = require('../models');
const { MessageUtil } = require('../utils');
const { CompetitorManager } = require('../models/owl_models');
const { Emojis } = require('../constants');
const Queries = require('../db/Queries');

class PredictionsCommand extends Command {
    constructor() {
        super();
        this.name = "predictions";
        this.description = "Displays a user's predictions";
        this.usage = "predictions";
        this.aliases = [];
    }

    async execute(client, message, args) {
        let predictions = await Queries.getPredictions(message.author.id);
        if (predictions.length === 0) {
            MessageUtil.sendError(message.channel, "Rippu I don't see any predictions for upcoming matches :C");
            return;
        }

        let embed = new PachimariEmbed(client);
        let info = [];
        embed.setTitle(`:crystal_ball: ${message.author.username}'s Predictions :sparkles:`);
        embed.setThumbnail(message.author.avatarURL);
        predictions.forEach(prediction => {
            let firstTeam = CompetitorManager.competitors.get(CompetitorManager.locateTeam(prediction.first_team.replace(/ /g,'')));
            let secondTeam = CompetitorManager.competitors.get(CompetitorManager.locateTeam(prediction.second_team.replace(/ /g,'')));
            let firstEmoji = Emojis[firstTeam.abbreviatedName];
            let secondEmoji = Emojis[secondTeam.abbreviatedName];
            info.push(`${firstEmoji} \`\`${firstTeam.abbreviatedName} ${prediction.first_score} - ${
                prediction.second_score} ${secondTeam.abbreviatedName}\`\` ${secondEmoji}`);
        });
        embed.setDescription(info);
        embed.buildEmbed().post(message.channel);
    }
}
module.exports = PredictionsCommand;