'use strict'

const { Command, PachimariEmbed } = require('../../../models')
const { CompetitorManager, Endpoints, Match } = require('../../../models/owl_models')
const { JsonUtil, Logger } = require('../../../utils')
const { Emojis } = require('../../../constants')
const stageData = require('../../../data/stages.json')
const momentTimezone = require('moment-timezone')

class ScheduleCommand extends Command {
  constructor () {
    super()
    this.name = 'schedule'
    this.description = 'Shows matches for the current stage and week'
    this.usage = 'schedule'
    this.aliases = ['matches']
  }

  async execute (client, message, args) {
    const embed = new PachimariEmbed(client)
    const matches = []
    let stageWeek = ''
    const pages = []; const dates = []
    let page = 1; let days = 1

    const loading = message.channel.send(Emojis.LOADING)

    // retrieve schedule data from API
    // message.channel.send(Emojis["LOADING"]);
    const body = await JsonUtil.parse(Endpoints.get('SCHEDULE'))
    const promise = new Promise(function (resolve, reject) {
      // const currentTime = new Date().getTime()
      // let slug = null
      // for (let i = 0; i < stageData.length; i++) {
      //   const stage = stageData[i]
      //   if (currentTime < stage.endDate) {
      //     slug = stage.slug
      //     break
      //   } 
      // }
      // organize data by stage and week
      for (const _stage of body.data.stages) {
        if (_stage.slug === 'all-star') {
          continue
        }
        // if (_stage.slug === slug) {
          for (const week of _stage.weeks) {
            // if ((currentTime < week.endDate) || (currentTime > week.startDate && currentTime < week.endDate)) {
              stageWeek = `${_stage.name}/${week.name}`
              week.matches.forEach(_match => {
                console.log('home team', _match.competitors[1])
                const home = CompetitorManager.competitors.get(CompetitorManager.locateTeam(_match.competitors[1].abbreviatedName))
                const away = CompetitorManager.competitors.get(CompetitorManager.locateTeam(_match.competitors[0].abbreviatedName))
                const match = new Match(_match.id, (_match.state === 'PENDING'),
                  _match.state, _match.startDate, home, away, _match.scores[1].value, _match.scores[0].value)
                matches.push(match)
              })
              // break
            // }
          // }
        }
      }
      resolve(1)
    })

    promise.then(function (result) {
      // add dummy match as a stop value
      const last = matches[0]
      matches.push(last)
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

      embed.setTitle(`__${dates[days - 1]} - ${stageWeek}__`)
      embed.setDescription(pages[page - 1])
      embed.setFooter(`Page ${page} of ${pages.length}. Only command author can turn pages`)
      Logger.custom('SCHEDULE_COMMAND', `Loading schedule for ${all}`)
    })
    promise.then(function (result) {
      const mess = embed.buildEmbed().getEmbed
      // loading.then(message => message.delete());
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
            embed.setTitle(`__${dates[days - 1]} - ${stageWeek}__`)
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
            embed.setTitle(`__${dates[days - 1]} - ${stageWeek}__`)
            embed.setDescription(pages[page - 1])
            embed.setFooter(`Page ${page} of ${pages.length}. Only command author can turn pages`)
            await r.remove(message.author.id)
            msg.edit(embed.buildEmbed().getEmbed)
          })
        })
      })
    })
    promise.catch(function (err) {
      Logger.error(err.stack)
    })
  }
}
module.exports = ScheduleCommand
