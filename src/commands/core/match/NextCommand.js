'use strict'

const { Command, PachimariEmbed } = require('../../../models')
const { CompetitorManager, Endpoints, Match, Banner } = require('../../../models/owl_models')
const { JsonUtil, AlertUtil, Logger } = require('../../../utils')
const { Emojis } = require('../../../constants')
const momentTimezone = require('moment-timezone')

class NextCommand extends Command {
  constructor () {
    super()
    this.name = 'next'
    this.description = 'Shows information about the next live match'
    this.usage = 'next'
    this.aliases = ['nextmatch']
  }

  async execute (client, message, args) {
    const loading = message.channel.send(Emojis.LOADING)
    const body = await JsonUtil.parse(Endpoints.get('LIVE-MATCH'))
    if (body.data.nextMatch === undefined || Object.keys(body.data.nextMatch).length === 0) {
      loading.then(message => message.edit("There's no next match available yet. Check back Later!"))
      return
    }

    const live = body.data.nextMatch
    const embed = new PachimariEmbed(client)
    const home = CompetitorManager.competitors.get(CompetitorManager.locateTeam(live.competitors[0].abbreviatedName))
    const away = CompetitorManager.competitors.get(CompetitorManager.locateTeam(live.competitors[1].abbreviatedName))
    const scoreHome = live.scores[0].value
    const scoreAway = live.scores[1].value
    Logger.custom('NEXT_COMMAND', 'Loading next match data.')
    const match = new Match(live.id, (live.state === 'PENDING'), live.state,
      live.startDateTS, home, away, scoreHome, scoreAway)

    const banner = new Banner(home.primaryColor, away.primaryColor,
      home.secondaryColor, away.secondaryColor, home.logoName, away.logoName)

    if (home.abbreviatedName === 'HOU') {
      banner.setHomePrimaryColor('#000000')
      banner.setHomeSecondaryColor(home.primaryColor)
    } else if (away.abbreviatedName === 'HOU') {
      banner.setAwayPrimaryColor('#000000')
      banner.setAwaySecondaryColor(away.primaryColor)
    }

    const pacificTime = momentTimezone(match.startDateTS).tz('America/Los_Angeles').format('h:mm A z')
    const utcTime = momentTimezone(match.startDateTS).utc().format('h:mm A z')

    if (match.pending) {
      embed.setTitle(`__Next Live Match: ${momentTimezone(match.startDateTS).tz('America/Los_Angeles').format('ddd. MMM Do, YYYY')}__`)
      const description = `*${pacificTime} / ${utcTime}*\n ${Emojis[match.home.abbreviatedName.toUpperCase()]} **${match.home.name}** vs **${
                match.away.name}** ${Emojis[match.away.abbreviatedName.toUpperCase()]}`

      embed.setDescription(description)
      embed.setThumbnail('')
    } else {
      loading.then(message => message.edit(AlertUtil.SUCCESS('Check back later for the next match!')))
      return
    }

    const filename = await banner.buildBanner('next.png')
    embed.setImageFileName(filename, 'next.png')
    embed.setColor(home.primaryColor)

    loading.then(message => message.delete())
    embed.buildEmbed().post(message.channel)
    // let mess = embed.buildEmbed().getEmbed;
    // loading.then(message => message.edit(mess));
  }
}
module.exports = NextCommand
