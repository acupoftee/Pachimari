'use strict'

const { Command, PachimariEmbed } = require('../../../models')
const { MessageUtil } = require('../../../utils')
// const Queries = require('../../../db/SettingQueries')
const Server = require('../../../dbv2/serverdb')
const botsettings = require('../../../data/botsettings.json')

class SettingsCommand extends Command {
  constructor () {
    super()
    this.name = 'settings'
    this.description = "View and update Pachimari's settings."
    this.usage = 'settings [set] <setting> [value]'
    this.aliases = ['options']
    this.permissions = ['MANAGE_GUILD']
  }

  async execute (client, message, args) {
    if (args.length <= 0) {
      const embed = new PachimariEmbed(client)
      embed.setTitle('Settings')
      embed.setDescription(`Use the format \`\`${client.prefix}settings <setting>\`\` for more information.`)

      // for (let i = 0; i < botsettings.length; i++) {
      //   const setting = botsettings[i]
      //   embed.addFields(setting.title,
      //               `\`\`${client.prefix}settings ${setting.commandKey}\`\``,
      //               true)
      // }
      const setting = botsettings[0]
      embed.addFields(setting.title,
        `\`\`${client.prefix}settings ${setting.commandKey}\`\``,
        true)

      embed.buildEmbed().post(message.channel)
    } else {
      const option = args[0].toLowerCase()
      let setting = null; let key = null

      for (let i = 0; i < botsettings.length; i++) {
        if (botsettings[i].commandKey === option) {
          setting = botsettings[i]
          key = botsettings[i].key
          break
        }
      }

      if (key === null) {
        MessageUtil.sendError(message.channel, ':C Sorry, I couldn\'t find that settigns. Maybe a typo?')
        return
      }

      if (args.length === 1) {
        const embed = new PachimariEmbed(client)
        embed.setTitle(`${setting.emote} ${setting.title}`)
        embed.setDescription(setting.description)
        embed.addFields('Usage', `\`\`${client.prefix}settings ${option}: ${setting.usage}\`\``)
        embed.addFields('Example', `\`\`${client.prefix}settings ${option} ${setting.example}\`\``)
        embed.buildEmbed().post(message.channel)
      } else if (args.length >= 2) {
        if (args[1].toLowerCase() !== 'set') {
          MessageUtil.sendError(message.channel, ':C Sorry, I couldn\'t find that sub. Maybe a typo?')
          return
        }

        if (!(args.length >= 3)) {
          MessageUtil.sendError(message.channel, ':C Sorry, I couldn\'t update that. Make sure you gave it a value!')
        } else {
          const value = args[2].toLowerCase()
          switch (key) {
            case 'prefix':
              // Queries.updatePrefix(message.guild.id, value)
              await Server.updateOne({
                guildID: message.guild.id.toString()
              }, { $set: { prefix: value } })
              break
            // case 'announce_owl':
            //   Queries.updateOwlAnnouncement(message.guild.id, value)
            //   break
            // case 'announce_owl_channel':
            //   Queries.updateOwlAnnouncementChannel(message.guild.id, value)
            //   break
            // case 'owl_twitter':
            //   Queries.updateOwlTwitter(message.guild.id, value)
            //   break
          }
          MessageUtil.sendSuccess(message.channel, `Updated ${key} to: ${value}`)
        }
      }
    }
  }
}
module.exports = SettingsCommand
