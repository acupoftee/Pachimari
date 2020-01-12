'use strict'

const { Command, PachimariEmbed } = require('../../../models')
const { CompetitorManager, Endpoints, Match } = require('../../../models/owl_models')
const { NumberUtil, MessageUtil, JsonUtil, AlertUtil, Logger } = require('../../../utils')
const { Emojis } = require('../../../constants')
const stageData = require('../../../data/stages.json')
const momentTimezone = require('moment-timezone')

/**
 * @class TeamCommand
 * @description represents a command retrieving information about
 * a specific Overwatch League Team
 */
class TeamCommand extends Command {
  /**
     * Instantiates a new TeamCommand
     * @constructor
     */
  constructor () {
    super()
    this.name = 'team'
    this.description = 'Shows information about a specific OWL team'
    this.usage = 'team <team> [accounts]'
    this.aliases = []
  }

  async execute (client, message, args) {
    if (args.length <= 0) {
      message.channel.send('Please specify an Overwatch League Team to look up.')
      return
    }

    const locateId = CompetitorManager.locateTeam(args[0])
    const competitor = CompetitorManager.competitors.get(locateId)
    const pages = []
    let page = 1

    if (competitor === undefined) {
      MessageUtil.sendError(message.channel, 'Could not locate team.')
      return
    }

    const embed = new PachimariEmbed(client)
    embed.setColor(competitor.primaryColor)
    const logo = competitor.abbreviatedName === 'CDH' ? competitor.altDark : competitor.logo
    embed.setThumbnail(logo)
    const teamEmoji = Emojis[competitor.abbreviatedName]
    const loading = message.channel.send(Emojis.LOADING)
    const teamStats = await CompetitorManager.updateTeamStats(competitor)

    competitor.setPlacement(teamStats[0])
    competitor.setMatchWin(teamStats[1])
    competitor.setMatchLoss(teamStats[2])
    competitor.setMatchDraw(teamStats[3])

    if (args[1] === undefined) {
      Logger.custom('TEAM_COMMAND', `Loading team ${competitor.name}`)
      embed.setTitle(`${teamEmoji} __${competitor.name}__ (${competitor.abbreviatedName})`)
      const teamInfo = []
      teamInfo.push(competitor.location + ' - ' + CompetitorManager.getDivision(competitor.divisionId).toString() + ' Division')
      teamInfo.push(NumberUtil.ordinal(competitor.placement) + ' in the Overwatch League')

      if (competitor.matchDraw > 0) {
        teamInfo.push('Record: ' + `${competitor.matchWin}W - ${competitor.matchLoss}L - ${competitor.matchDraw}T\n`)
      } else {
        teamInfo.push('Record: ' + `${competitor.matchWin}W - ${competitor.matchLoss}L`)
      }

      if (competitor.website !== null) {
        embed.addFields('Website', `[Click Here](${competitor.website})`, true)
      }
      const members = []
      let offense = 0; let tanks = 0; let supports = 0
      competitor.players.forEach(player => {
        const countryEmoji = MessageUtil.getFlag(player.nationality)
        const roleEmoji = Emojis[player.role.toUpperCase()]
        members.push(`${countryEmoji}${roleEmoji} ${player.givenName} '**${player.name}**' ${player.familyName}`)
        if (player.role === 'offense') {
          offense++
        } else if (player.role === 'tank') {
          tanks++
        } else if (player.role === 'support') {
          supports++
        }
      })
      embed.addFields(`${competitor.players.size} Players - ${tanks} tanks, ${offense} offense, ${supports} supports`, members)
      embed.setDescription(teamInfo)
      if (competitor.accounts.size > 0) {
        const word = competitor.accounts.size > 1 ? 'Accounts' : 'Account'
        embed.addFields(`${competitor.accounts.size} ${word}`, `\`\`${client.prefix}team ${args[0]} accounts\`\``, true)
      }
      const mess = embed.buildEmbed().getEmbed
      loading.then(message => message.edit(mess))
    } else {
      if (args[1].toLowerCase() === 'accounts') {
        Logger.custom('TEAM_COMMAND ACCOUNTS', `Loading ACCOUNTS for team ${competitor.name}`)
        if (competitor.accounts.size === 0) {
          MessageUtil.sendError(message.channel, 'This team does not have any accounts.')
          return
        }
        const accs = []
        embed.setTitle(`${Emojis[competitor.abbreviatedName]} __${competitor.name}'s Accounts__`)
        competitor.accounts.forEach(account => {
          const accountEmoji = Emojis[account.type.toUpperCase()]
          accs.push(`${accountEmoji} [${account.type}](${account.url})`)
        })
        const msg = accs.join('\n')
        embed.setDescription(msg)
        const mess = embed.buildEmbed().getEmbed
        loading.then(message => message.edit(mess))
      } else {
        loading.then(message => message.edit(AlertUtil.ERROR(":C Sorry I couldn't understand that. Maybe a typo?")))
      }
    }
  }
}
module.exports = TeamCommand
