'use strict'
const { Command, PachimariEmbed } = require('../../../models')
// const { MessageUtil } = require('../../../utils')
// const { Emojis } = require('../../../constants')
const Queries = require('../../../db/ProfileQueries')

const predictionScore = 0; const serverRank = 0; const globalRank = 0; const numPredictions = 0; const bio = 'Hi notice me senpai'

class ProfileCommand extends Command {
  constructor () {
    super()
    this.name = 'profile'
    this.description = "Shows a member's statistics"
    this.usage = 'profile'
    this.aliases = []
  }

  async execute (client, message, args) {
    const id = message.author.id
    const embed = new PachimariEmbed(client)
    let profile = await Queries.getProfile(id)
    if (Object.keys(profile).length === 0) {
      Queries.createProfile(id, predictionScore, serverRank, globalRank, numPredictions, bio)
      profile = await Queries.getProfile(id)
    }
    // if (args.length == 2) {
    //     if (args[0] == 'bio') {
    //         Queries.updateBio(id, args[1]);
    //     }
    //     MessageUtil.sendSuccess(message.channel, `Updated ${args[0]} to: ${args[1]}`);
    //     return;
    // }
    embed.setThumbnail(message.author.avatarURL)
    embed.setTitle(message.author.username)
    embed.addFields('Bio', `${profile[0].bio}\n\n`)
    embed.addFields(':trophy: Server Rank', `#${profile[0].server_rank}`)
    embed.addFields(':earth_africa: Global Rank', `#${profile[0].global_rank}`)
    embed.buildEmbed().post(message.channel)
  }
}
module.exports = ProfileCommand
