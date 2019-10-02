const { Command, PachimariEmbed } = require('../../../models')
const { MessageUtil } = require('../../../utils')
const { CompetitorManager, MatchManager } = require('../../../models/owl_models')
const { Emojis } = require('../../../constants')
const Queries = require('../../../db/Queries')

class PredictionsCommand extends Command {
  constructor () {
    super()
    this.name = 'predictions'
    this.description = "Shows a user's predictions"
    this.usage = 'predictions'
    this.aliases = []
  }

  async execute (client, message, args) {
    message.channel.startTyping()
    const predictions = await Queries.getPredictions(message.author.id)
    if (predictions.length === 0) {
      MessageUtil.sendError(message.channel, "Rippu I don't see any predictions for upcoming matches :C")
      return
    }

    const embed = new PachimariEmbed(client)
    const info = []

    if (args.length === 2) {
      const firstTeam = CompetitorManager.competitors.get(CompetitorManager.locateTeam(args[0]))
      const secondTeam = CompetitorManager.competitors.get(CompetitorManager.locateTeam(args[1]))
      if (firstTeam === undefined || secondTeam === undefined) {
        message.channel.stopTyping()
        MessageUtil.sendError(message.channel, "Rippu I can't find those teams. Maybe a typo? :C")
        return
      }

      const prediction = await Queries.getPredicitionBasedOnTeams(firstTeam.name, secondTeam.name, message.author.id)
      if (Object.keys(prediction).length === 0) {
        message.channel.stopTyping()
        MessageUtil.sendError(message.channel, "Rippu I don't see any predictions for that match :C")
        return
      }
      const scores = await MatchManager.getMatchBetweenTeams(firstTeam.id, secondTeam.id)
      embed.setTitle(`:crystal_ball: __${message.author.username}'s Prediction Results__ :sparkles:`)

      const firstEmoji = Emojis[firstTeam.abbreviatedName]
      const secondEmoji = Emojis[secondTeam.abbreviatedName]
      info.push(`Prediction\n${firstEmoji} \`\`${firstTeam.abbreviatedName} ${prediction[0].first_score} - ${
                prediction[0].second_score} ${secondTeam.abbreviatedName}\`\` ${secondEmoji}\n\nResult\n${
                    firstEmoji} \`\`${firstTeam.abbreviatedName} ${scores[0]} - ${
                        scores[1]} ${secondTeam.abbreviatedName}\`\` ${secondEmoji}`)
    } else {
      embed.setTitle(`:crystal_ball: ${message.author.username}'s Predictions :sparkles:`)
      predictions.forEach(prediction => {
        const firstTeam = CompetitorManager.competitors.get(CompetitorManager.locateTeam(prediction.first_team.replace(/ /g, '')))
        const secondTeam = CompetitorManager.competitors.get(CompetitorManager.locateTeam(prediction.second_team.replace(/ /g, '')))
        const firstEmoji = Emojis[firstTeam.abbreviatedName]
        const secondEmoji = Emojis[secondTeam.abbreviatedName]
        info.push(`${firstEmoji} \`\`${firstTeam.abbreviatedName} ${prediction.first_score} - ${
                    prediction.second_score} ${secondTeam.abbreviatedName}\`\` ${secondEmoji}`)
      })
    }
    embed.setThumbnail(message.author.avatarURL)
    embed.setDescription(info)
    message.channel.stopTyping()
    embed.buildEmbed().post(message.channel)
  }
}
module.exports = PredictionsCommand
