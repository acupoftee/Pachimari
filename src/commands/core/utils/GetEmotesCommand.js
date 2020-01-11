
const { Command, PachimariEmbed } = require('../../../models')
const { Logger } = require('../../../utils')

class GetEmotesCommand extends Command {
  constructor () {
    super()

    this.name = 'emotes'
    this.description = 'Personal utility'
    this.usage = 'emotes'
    this.aliases = ['botinfo']
  }

  async execute (client, message, args) {
    Logger.custom('EMOTES_COMMAND', 'Loading server info')
    const emotes = []
    const guild = client.guilds.get(message.guild.id)
    const emojis = guild.emojis.values()
    for (const emoji of emojis) {
      console.log(`${emoji.name.toUpperCase()}: '<:${emoji.name}:${emoji.id}>',`)
    }
  }
}
module.exports = GetEmotesCommand
