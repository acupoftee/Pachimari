'use strict'

const { Command, PachimariEmbed } = require('../../../models')
const { CompetitorManager, Endpoints, Match } = require('../../../models/owl_models')
const { AlertUtil, JsonUtil, Logger } = require('../../../utils')
const { Emojis } = require('../../../constants')
// const stageData = require('../../../data/stages.json')
const momentTimezone = require('moment-timezone')

class ScheduleCommand extends Command {
  constructor () {
    super()
    this.name = 'schedule'
    this.description = 'Shows matches for the current stage and week'
    this.usage = 'schedule [stage] <number>'
    this.aliases = ['matches']
  }

  async execute (client, message, args) {
    const embed = new PachimariEmbed(client)
    const matches = []
    const pages = []
    const dates = []
    let page = 1
    let days = 1
    let stageTitle

    const loading = message.channel.send(Emojis.LOADING)

    // retrieve schedule data from API
    const body = await JsonUtil.parse(Endpoints.get('SCHEDULE'))

    if (args[0] && args[0].toLowerCase() === 'stage') {
      const stageNumber = args[1]
      if (isNaN(stageNumber)) {
        loading.then(message => message.edit(AlertUtil.ERROR(':C Please enter a valid stage number')))
        return
      } else if (stageNumber < 1 || stageNumber > 4) {
        loading.then(message => message.edit(AlertUtil.ERROR(':C Sorry I could not find that stage')))
        return
      }
      for (const stage of body.data.stages) {
        // Check if we've received the correct stage
        if (stage.slug.includes(stageNumber)) {
          stageTitle = `Stage ${stageNumber}`
          this.getMatchesByWeek(stage, matches)
          break
        }
      }
    // } else if (args[0]) {
    //   const date = Date.parse(args[0])
    //   if (isNaN(date)) {
    //     loading.then(message => message.edit(AlertUtil.ERROR(':C Please enter a valid date (mm-dd-yyyy)')))
    //   } else if (date < 1549872000000 || date > 1566802800000) {
    //     loading.then(message => message.edit(AlertUtil.ERROR('Please enter a date between 2-14-2019 and 8-27-2019')))
    //   } else {
    //     loading.then(message => message.edit('good date'))
    //     console.log(this.getMatchByDate(body, date, matches))
    //   }
    //   return
    } else {
      for (const stage of body.data.stages) {
        if (stage.slug === 'all-star') {
          continue
        }
        this.getMatchesByWeek(stage, matches)
      }
    }

    // add dummy match as a stop value
    const last = matches[0]
    matches.push(last)

    // Sort matches based by day
    let daysMatch = []
    for (let i = 0; i < matches.length - 1; i++) {
      const date = momentTimezone(matches[i].startDateTS).tz('America/Los_Angeles').format('ddd. MMM Do, YYYY')
      const nextDay = `${momentTimezone(matches[i + 1].startDateTS).tz('America/Los_Angeles').format('ddd. MMM Do, YYYY')}`
      if (!dates.includes(date)) {
        dates.push(date)
      }
      const awayTitle = `${Emojis[matches[i].away.abbreviatedName]} **${matches[i].away.name}**`
      const homeTitle = `**${matches[i].home.name}** ${Emojis[matches[i].home.abbreviatedName]}`
      const pacificTime = momentTimezone(matches[i].startDateTS).tz('America/Los_Angeles').format('h:mm A z')
      const utcTime = momentTimezone(matches[i].startDateTS).utc().format('h:mm A z')
      if (matches[i].pending) {
        daysMatch.push(`*${pacificTime} / ${utcTime}*\n${awayTitle} vs ${homeTitle}\n`)
      } else if (matches[i].state === 'IN_PROGRESS') {
        daysMatch.push(`*${pacificTime} / ${utcTime}* - ***NOW LIVE***\n[Watch full match here!](https://overwatchleague.com/en-us/)\n${awayTitle} ||${matches[i].scoreAway} - ${matches[i].scoreHome}|| ${homeTitle}\n`)
      } else {
        daysMatch.push(`*${pacificTime} / ${utcTime}*\n${awayTitle} ||${matches[i].scoreAway} - ${matches[i].scoreHome}|| ${homeTitle}\n`)
      }
      // if we've gone through all matches for that week,
      // start the next page for the next day
      if (date !== nextDay) {
        pages.push(daysMatch)
        daysMatch = []
      }
    }

    embed.setTitle(`__${dates[days - 1]}${stageTitle ? ' - ' + stageTitle : ''}__`)
    embed.setDescription(pages[page - 1])
    embed.setFooter(`Page ${page} of ${pages.length}. Only command author can turn pages`)
    Logger.custom('SCHEDULE_COMMAND', 'Loading schedule')
    const mess = embed.buildEmbed().getEmbed
    loading.then(message => message.edit(mess)).then(msg => {
      msg.react('⬅').then(r => {
        msg.react('➡')

        const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅' && user.id === message.author.id
        const forwardFilter = (reaction, user) => reaction.emoji.name === '➡' && user.id === message.author.id

        const backwards = msg.createReactionCollector(backwardsFilter)
        const forwards = msg.createReactionCollector(forwardFilter) // { time: 100000 }

        backwards.on('collect', async r => {
          if (page === 1) {
            await r.remove(message.author.id)
            return
          }
          page--
          days--
          embed.setTitle(`__${dates[days - 1]}${stageTitle ? ' - ' + stageTitle : ''}__`)
          embed.setDescription(pages[page - 1])
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
          days++
          embed.setTitle(`__${dates[days - 1]}${stageTitle ? ' - ' + stageTitle : ''}__`)
          embed.setDescription(pages[page - 1])
          embed.setFooter(`Page ${page} of ${pages.length}. Only command author can turn pages`)
          await r.remove(message.author.id)
          msg.edit(embed.buildEmbed().getEmbed)
        })
      })
    })
  }

  getMatchesByWeek (stage, matches) {
    for (const week of stage.weeks) {
      for (const match of week.matches) {
        const home = CompetitorManager.competitors.get(CompetitorManager.locateTeam(match.competitors[1].abbreviatedName))
        const away = CompetitorManager.competitors.get(CompetitorManager.locateTeam(match.competitors[0].abbreviatedName))
        const stageMatch = new Match(match.id, (match.state === 'PENDING'),
          match.state, match.startDate, home, away, match.scores[1].value, match.scores[0].value)
        matches.push(stageMatch)
      }
    }
  }

  // getMatchByDate(schedule, date, matches) {
  //   for (const stage of schedule.data.stages) {
  //     for (const week of stage.weeks) {
  //       for (const match of week.matches) {
  //         if (match.startDate === date) {
  //           const home = CompetitorManager.competitors.get(CompetitorManager.locateTeam(match.competitors[1].abbreviatedName))
  //           const away = CompetitorManager.competitors.get(CompetitorManager.locateTeam(match.competitors[0].abbreviatedName))
  //           const stageMatch = new Match(match.id, (match.state === 'PENDING'),
  //             match.state, match.startDate, home, away, match.scores[1].value, match.scores[0].value)
  //           matches.push(stageMatch)
  //         }
  //       }
  //     }
  //   }
  //   console.log(matches)
  // }
}
module.exports = ScheduleCommand
