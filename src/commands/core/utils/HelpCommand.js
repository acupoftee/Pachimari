const { Command, PachimariEmbed } = require('../../../models')
const { MessageUtil, Logger } = require('../../../utils')
const Server = require('../../../dbv2/serverdb')
class HelpCommand extends Command {
  constructor () {
    super()
    this.name = 'help'
    this.description = 'List available commands.'
    this.usage = 'help [command]'
    this.aliases = []
  }

  async execute (client, message, args) {
    const embed = new PachimariEmbed(client)
    embed.setThumbnail(client.user.avatarURL)
    const server = await Server.findOne({ guildID: message.guild.id.toString() })
    const prefix = server.prefix
    if (args.length <= 0) {
      Logger.custom('HELP_COMMAND', 'Loading command list')
      embed.setTitle('Commands')
      embed.setDescription('Use ``' + prefix + 'help <command>`` for more info.')
      const cmds = []

      client.commands.forEach(command => {
        cmds.push(`**${prefix}${command.name}**:\t${command.description}`)
      })
      embed.addFields('Descriptions', cmds)
      embed.buildEmbed().post(message.channel)
    } else {
      const command = args[0].toLowerCase()
      if (!client.commands.has(command)) { return }
      const cmd = client.commands.get(command)
      embed.setTitle(MessageUtil.capitalize(cmd.name) + ' Command')
      Logger.custom('HELP_COMMAND CMD', `Loading help for ${cmd.name} Command`)
      embed.setDescription(cmd.description)
      embed.addFields('Usage', `${prefix}${cmd.usage}`)
      embed.buildEmbed().post(message.channel)
    }
  }
}
module.exports = HelpCommand
