'use strict'

const { Command, PachimariEmbed } = require('../../../models')
const { Logger } = require('../../../utils')
const { Emojis } = require('../../../constants')
const pckg = require('../../../../package.json')

class InfoCommand extends Command {
  constructor () {
    super()

    this.name = 'info'
    this.description = 'Shares bot information.'
    this.usage = 'info'
    this.aliases = ['botinfo']
  }

  async execute (client, message, args) {
    Logger.custom('INFO_COMMAND', 'Loading server info')
    const embed = new PachimariEmbed(client).setTitle(`✨ Pachimari Bot Information (v${pckg.version})`)
    embed.setDescription('Thank you for using me as your friendly neighborhood Overwatch League pal!')
    embed.setThumbnail(client.user.avatarURL)

    embed.addFields('Servers', client.guilds.size, true)
    // embed.addFields("Creator", "dustybutton#7350");
    embed.addFields('Users', client.users.size, true)
    embed.addFields(
      ':money_with_wings: Support Pachimari\'s development <3',
      'https://www.paypal.me/pachimariapp'
    )
    embed.addFields(
      ':sos: Support Server',
      ' https://discord.gg/KUg6rKz'
    )
    embed.addFields(
      ':signal_strength: Website',
      'https://acupoftee.github.io/Pachimari-Dashboard'
    )
    embed.addFields(
      ':heart_decoration: Invite me to your server ヾ(๑╹◡╹)ﾉ',
      'https://tinyurl.com/y48es8jw'
    )
    embed.addFields(
      ':up: Upvote me on Discordbots.org (╹◡╹๑)',
      'https://tinyurl.com/y3mhfr8l'
    )
    embed.addFields(
      `${Emojis.TWITTER} Follow me on Twitter (^_^)`,
      'https://twitter.com/PachimariApp'
    )
    embed.buildEmbed().post(message.channel)
  }
}
module.exports = InfoCommand
