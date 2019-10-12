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
    this.usage = 'team <team> [accounts|schedule]'
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
        embed.addFields(`${competitor.accounts.size} ${word}`, `\`\`!team ${args[0]} accounts\`\``, true)
      }
      embed.addFields('Schedule', `\`\`!team ${args[0]} schedule\`\``, true)
      // loading.then(message => message.delete());
      // embed.buildEmbed().post(message.channel);
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
        // loading.then(message => message.delete());
        // embed.buildEmbed().post(message.channel);
        const mess = embed.buildEmbed().getEmbed
        loading.then(message => message.edit(mess))
      } else if (args[1].toLowerCase() === 'schedule') {
        const matches = []
        let stage = ''
        const body = await JsonUtil.parse(Endpoints.get('SCHEDULE'))
        Logger.custom('TEAM_COMMAND SCHEDULE', `Loading SCHEDULE for team ${competitor.name}`)

        const currentTime = new Date().getTime()
        let slug = null
        for (let i = 0; i < stageData.length; i++) {
          stage = stageData[i]
          if (currentTime > stage.startDate && currentTime < stage.endDate) {
            slug = stage.slug
          }
        }
        // organize data by stage and week
        body.data.stages.forEach(_stage => {
          if (_stage.slug === slug) {
            stage = _stage.name
            _stage.weeks.forEach(week => {
              week.matches.forEach(_match => {
                if (_match.competitors[0].id === competitor.id || _match.competitors[1].id === competitor.id) {
                  const home = CompetitorManager.competitors.get(CompetitorManager.locateTeam(_match.competitors[1].abbreviatedName))
                  const away = CompetitorManager.competitors.get(CompetitorManager.locateTeam(_match.competitors[0].abbreviatedName))
                  const match = new Match(_match.id, (_match.state === 'PENDING'),
                    _match.state, _match.startDate, home, away, _match.scores[1].value, _match.scores[0].value)
                  matches.push(match)
                }
              })
            })
          }
        })

        const daysMatch = []; const previousMatches = []
        matches.forEach(match => {
          const awayTitle = `${Emojis[match.away.abbreviatedName]} **${match.away.name}**`
          const homeTitle = `**${match.home.name}** ${Emojis[match.home.abbreviatedName]}`
          const date = momentTimezone(match.startDateTS).tz('America/Los_Angeles').format('dddd MMM Do')
          const pacificTime = momentTimezone(match.startDateTS).tz('America/Los_Angeles').format('h:mm A z')
          const utcTime = momentTimezone(match.startDateTS).utc().format('h:mm A z')
          if (match.pending) {
            daysMatch.push(`${date}\n*${pacificTime} / ${utcTime}*\n${awayTitle} vs ${homeTitle}\n`)
          } else if (match.state === 'IN_PROGRESS') {
            daysMatch.push(`*${pacificTime} / ${utcTime}* - ***NOW LIVE***\n[Watch full match here!](https://overwatchleague.com/en-us/)\n${awayTitle} ||${match.scoreAway} - ${match.scoreHome}|| ${homeTitle}\n`)
          } else {
            previousMatches.push(`${date}, ${momentTimezone(match.startDateTS).startOf('hour').fromNow()}\n*${pacificTime} / ${utcTime}*\n${awayTitle} ||${match.scoreAway} - ${match.scoreHome}|| ${homeTitle}\n`)
          }
        })
        if (daysMatch.length === 0) {
          daysMatch.push(`:x: No upcoming ${stage} matches. Check back for the next stage!`)
        }
        pages.push(daysMatch)
        previousMatches.reverse()
        pages.push(previousMatches)
        embed.setDescription(pages[page - 1])
        embed.setTitle(`__Upcoming ${stage} Matches for ${competitor.name}__`)
        embed.setFooter(`Page ${page} of ${pages.length}. Only command author can turn pages`)
        // loading.then(message => message.delete());
        const mess = embed.buildEmbed().getEmbed
        loading.then(message => message.edit(mess)).then(msg => {
          msg.react('🔄').then(r => {
            const switchFilter = (reaction, user) => reaction.emoji.name === '🔄' && user.id === message.author.id
            const refresh = msg.createReactionCollector(switchFilter, { time: 60000 })
            refresh.on('collect', r => {
              if (page % 2 === 0) {
                page--
                embed.setTitle(`__Upcoming ${stage} Matches for ${competitor.name}__`)
              } else {
                page++
                embed.setTitle(`__Previous ${stage} Matches for ${competitor.name}__`)
              }
              embed.setDescription(pages[page - 1])
              embed.setFooter(`Page ${page} of ${pages.length}. Only command author can turn pages`)
              msg.edit(embed.buildEmbed().getEmbed)
              r.remove(message.author.id)
            })
          })
        })
      } else {
        loading.then(message => message.edit(AlertUtil.ERROR(":C Sorry I couldn't understand that. Maybe a typo?")))
      }
    }
  }
}
module.exports = TeamCommand
