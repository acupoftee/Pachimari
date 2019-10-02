'use strict'

const { Command, PachimariEmbed } = require('../../../models')
const { CompetitorManager } = require('../../../models/owl_models')
const { Emojis } = require('../../../constants')
const { Logger } = require('../../../utils')
const discordServers = require('../../../data/discords.json')
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
  constructor () {
    super()
    this.name = 'teamcords'
    this.description = 'Shows Discord servers for OWL teams'
    this.usage = 'teamcords'
    this.aliases = ['discords', 'teamdiscords']
  }

  // O(n*d) time. Optimize?
  async execute (client, message, args) {
    Logger.custom('TEAMCORD_COMMAND', 'Loading team Discords')
    if (args.length <= 0) {
      message.channel.startTyping()
      const discords = []
      CompetitorManager.competitors.forEach(competitor => {
        const teamEmoji = Emojis[competitor.abbreviatedName]
        let discord = CompetitorManager.locateAccount(competitor, 'DISCORD')
        if (discord === undefined) {
          for (let i = 0; i < discordServers.length; i++) {
            const server = discordServers[i]
            if (server.team === competitor.name) {
              discord = server.url
            }
          }
        }
        discords.push(`${teamEmoji}[${competitor.name}](${discord})`)
      })
      const msg = discords.join('\n')
      const embed = new PachimariEmbed(client)
      embed.setTitle('__Overwatch League Team Discords__')
      embed.setThumbnail('https://cdn.discordapp.com/emojis/549030645226143757.png?v=1')
      embed.setColor('#7289DA')
      embed.setDescription(msg)
      message.channel.stopTyping()
      embed.buildEmbed().post(message.channel)
    }
  }
}
module.exports = TeamcordsCommand
