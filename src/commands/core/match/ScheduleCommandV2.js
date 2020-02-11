'use strict'

const { Command, PachimariEmbed } = require('../../../models')
const { AlertUtil, JsonUtil, Logger } = require('../../../utils')
const { Emojis } = require('../../../constants')
const momentTimezone = require('moment-timezone')
const _ = require('lodash')

class ScheduleCommandv2 extends Command {
  constructor () {
    super()
    this.name = 'schedule'
    this.description = 'Shows matches for the current stage and week'
    this.usage = 'schedule [stage] <number>'
    this.aliases = ['matches']
  }

  async execute (client, message, args) {
    const embed = new PachimariEmbed(client)
    const headers = { 'Content-Type': 'application/json', referer: 'https://overwatchleague.com/en-us' }
    // const weeks = 27
    const titles = []
    const games = []
    const addresses = []
    let pages = []
    let venues = []
    let buildings = []
    let page = 1
    let title = 1
    let address = 1

    const loading = message.channel.send(Emojis.LOADING)

    if (args.length > 0 && args[0].toLowerCase() === 'week') {
      if (!args[1] || args[1] > 27 || args[1] < 1 || isNaN(args[1])) {
        loading.then(message => message.edit(AlertUtil.ERROR('Please enter a week between 1 and 27')))
        return
      }
      const body = await JsonUtil.parse(`https://wzavfvwgfk.execute-api.us-east-2.amazonaws.com/production/owl/paginator/schedule?stage=regular_season&page=${args[1]}&season=2020&season=2020&locale=en-us`, headers)
      this.getSchedule(body, titles, addresses, games)
      pages = _.chunk(games, games.length / 2)
      venues = _.chunk(titles, titles.length / 2)
      buildings = _.chunk(addresses, addresses.length / 2)
    } else {
      loading.then(message => message.edit(AlertUtil.SUCCESS('We\'re buffed baby! Use ' + `\`${client.prefix}schedule week <number>\`` + ' this time to get the schedule for the week! C:')))
      return
    }

    embed.setTitle(`__${venues[title - 1][0].embedTitle}__`)
    embed.setThumbnail(venues[title - 1][0].thumbnail)
    embed.setDescription(`${buildings[address - 1][0]}\n\n ${pages[page - 1].join('\n')}`)
    embed.setFooter(`Page ${page} of ${pages.length}. Only command author can turn pages`)
    Logger.custom('SCHEDULE_COMMAND', 'Loading schedule')
    const mess = embed.buildEmbed().getEmbed

    loading.then(message => message.edit(mess)).then(msg => {
      msg.react('⬅').then(r => {
        msg.react('➡')

        const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅' && user.id === message.author.id
        const forwardFilter = (reaction, user) => reaction.emoji.name === '➡' && user.id === message.author.id

        const backwards = msg.createReactionCollector(backwardsFilter)
        const forwards = msg.createReactionCollector(forwardFilter)

        backwards.on('collect', async r => {
          if (page === 1) {
            await r.remove(message.author.id)
            return
          }
          page--
          title--
          address--
          embed.setTitle(`__${venues[title - 1][title - 1].embedTitle !== 'New Match' ? venues[title - 1][title - 1].embedTitle : venues[title - 2][title - 2].embedTitle}__`)
          embed.setThumbnail(venues[title - 1][title - 1].thumbnail !== 'New Image' ? venues[title - 1][title - 1].thumbnail : venues[title - 2][title - 2].thumbnail)
          embed.setDescription(`${buildings[address - 1][address]}\n\n ${pages[page - 1].join('\n')}`)
          embed.setFooter(`Page ${page} of ${pages.length}. Only command author can turn pages`)
          await r.remove(message.author.id)
          msg.edit(embed.buildEmbed().getEmbed)
        })

        forwards.on('collect', async r => {
          if (page === pages.length) {
            r.remove(message.author.id)
            return
          }
          page++
          title++
          address++
          embed.setTitle(`__${venues[title - 1][title - 1].embedTitle !== 'New Match' ? venues[title - 1][title - 1].embedTitle : venues[title - 2][title - 2].embedTitle}__`)
          embed.setThumbnail(venues[title - 1][title - 1].thumbnail !== 'New Image' ? venues[title - 1][title - 1].thumbnail : venues[title - 2][title - 2].thumbnail)
          embed.setDescription(`${buildings[address - 1][address - 1] || buildings[address - 2][address - 2]}\n\n ${pages[page - 1].join('\n')}`)
          embed.setFooter(`Page ${page} of ${pages.length}. Only command author can turn pages`)
          await r.remove(message.author.id)
          msg.edit(embed.buildEmbed().getEmbed)
        })
      })
    })
  }

  getSchedule (body, titles, addresses, games) {
    const events = body.content.tableData.events

    for (let i = 0; i < events.length; i++) {
      const matches = events[i].matches

      for (let j = 0; j < matches.length; j++) {
        titles.push({ embedTitle: events[i].eventBanner !== null ? events[i].eventBanner.title.replace('Banner', '') : 'New Match', thumbnail: events[i].eventBanner !== null ? events[i].eventBanner.featuredImage : 'New Image' })
        const venue = events[i].eventBanner && `Venue: ${events[i].eventBanner.venue.name}\n${events[i].eventBanner.venue.location}\n🎟 [Buy Tickets](${events[i].eventBanner && events[i].eventBanner.ticket.link.href})`
        addresses.push(venue)
        const date = momentTimezone(matches[j].startDate).tz('America/Los_Angeles').format('ddd. MMM Do, YYYY')
        const awayTitle = `${Emojis[matches[j].competitors[0].abbreviatedName]} **${matches[j].competitors[0].name}**`
        const homeTitle = `**${matches[j].competitors[1].name}** ${Emojis[matches[j].competitors[1].abbreviatedName]}`
        const pacificTime = momentTimezone(matches[j].startDate).tz('America/Los_Angeles').format('h:mm A z')
        const utcTime = momentTimezone(matches[j].startDate).utc().format('h:mm A z')

        if (matches[j].status === 'PENDING') {
          games.push(`${date}\n*${pacificTime} / ${utcTime}*\n${awayTitle} vs ${homeTitle}\n`)
        } else if (matches[j].status === 'ONGOING') {
          games.push(`${date}\n*${pacificTime} / ${utcTime}* - ***NOW LIVE***\n[Watch full match here!](https://overwatchleague.com/en-us/)\n${awayTitle} ||${matches[j].scores[0]} - ${matches[j].scores[1]}|| ${homeTitle}\n`)
        } else {
          games.push(`${date}\n*${pacificTime} / ${utcTime}*\n${awayTitle} ||${matches[j].scores[0]} - ${matches[j].scores[1]}|| ${homeTitle}\n`)
        }
      }
    }
  }
}

module.exports = ScheduleCommandv2
