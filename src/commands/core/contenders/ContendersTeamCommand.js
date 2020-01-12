'use strict'

const { Command, PachimariEmbed } = require('../../../models')
const { ContendersCompetitorManager } = require('../../../models/contenders')
const { NumberUtil, MessageUtil, JsonUtil, AlertUtil, Logger } = require('../../../utils')
const { Emojis } = require('../../../constants')
// const momentTimezone = require('moment-timezone')

/**
 * @class ContendersTeamCommand
 * @description represents a command retrieving information about
 * a specific Overwatch League Team
 */
class ContendersTeamCommand extends Command {
  /**
     * Instantiates a new ContendersTeamCommand
     * @constructor
     */
  constructor () {
    super()
    this.name = 'cteam'
    this.description = 'Shows information about a specific Contenders team'
    this.usage = 'cteam <team>'
    this.aliases = []
  }

  async execute (client, message, args) {
    if (args.length <= 0) {
      message.channel.send('Please specify an Overwatch League Team to look up.')
      return
    }

    const locateId = ContendersCompetitorManager.locateTeam(args[0])
    const competitor = ContendersCompetitorManager.contendersCompetitors.get(locateId)

    if (competitor === undefined) {
      MessageUtil.sendError(message.channel, 'Could not locate team.')
      return
    }

    const embed = new PachimariEmbed(client)
    embed.setColor(competitor.primaryColor)
    embed.setThumbnail(competitor.logo)
    const teamEmoji = Emojis[competitor.abbreviatedName.toUpperCase()]
    const loading = message.channel.send(Emojis.LOADING)

    if (args[1] === undefined) {
      Logger.custom('CONTENDERS_TEAM_COMMAND', `Loading team ${competitor.name}`)
      embed.setTitle(`${teamEmoji} __${competitor.name}__ (${competitor.abbreviatedName})`)

      const members = []
      const region = this.getFullRegionName(competitor.region)

      competitor.players.forEach(player => {
        const countryEmoji = MessageUtil.getFlag(player.nationality)
        members.push(`${countryEmoji} ${player.givenName} '**${player.name}**' ${player.familyName}`)
      })

      if (members.length > 0) {
        embed.setDescription(`${region}`)
        embed.addFields(`${competitor.players.size} Players`, members)
      } else {
        embed.setDescription(`${region}\n\nNo roster available yet. Check back soon.`)
      }

      const mess = embed.buildEmbed().getEmbed
      loading.then(message => message.edit(mess))
    }
  }

  getFullRegionName (initials) {
    switch (initials) {
      case 'OC':
        return 'Australia'
      case 'AS':
        return 'Pacific'
      case 'CN':
        return 'China'
      case 'KR':
        return 'Korea'
      case 'NA West':
        return 'North America - West Coast'
      case 'NA East':
        return 'North America East Coast'
      case 'EU':
        return 'Europe'
      case 'SA':
        return 'South America'
    }
  }
}
module.exports = ContendersTeamCommand
