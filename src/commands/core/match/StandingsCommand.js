'use strict'

const { Command, PachimariEmbed } = require('../../../models')
const { CompetitorManager, Endpoints } = require('../../../models/owl_models')
const { JsonUtil, Logger } = require('../../../utils')
const { Emojis } = require('../../../constants')
const stageData = require('../../../data/stages.json')

/**
 * @class StandingsCommand
 * @description represents a command that lists all Competitors
 * Standings in the Overwatch League
 */
class StandingsCommand extends Command {
  /**
     * Instantiates a new StandingsCommand
     * @constructor
     */
  constructor () {
    super()
    this.name = 'standings'
    this.description = 'Shows the current standings for this season'
    this.usage = 'standings [playoffs]'
    this.aliases = []
  }

  async execute (client, message, args) {
    const loading = message.channel.send(Emojis.LOADING)
    const info = []; const pages = []; const titles = []
    let page = 0; let titleNumber = 0
    const embed = new PachimariEmbed(client)
    titles.push(':trophy: __Overwatch League Standings__')

    const stageIds = this.getAvailableStages()
    const stageSlugs = this.getAvailableSlugs()

    const reactions = ['\u0031\u20E3',
      '\u0032\u20E3',
      '\u0033\u20E3',
      '\u0034\u20E3']

    Logger.custom('STANDINGS_COMMAND', 'Loading standings data.')
    const body = await JsonUtil.parse(Endpoints.get('STANDINGS'))
    for (let i = 0; i < CompetitorManager.competitors.size; i++) {
      const standing = body.data[i]
      const matchWin = standing.league.matchWin
      const matchLoss = standing.league.matchLoss
      let mapDiff = standing.league.comparisons[1].value
      if (mapDiff >= 0) {
        mapDiff = '+' + mapDiff
      }
      const teamEmoji = Emojis[standing.abbreviatedName]
      const numberData = `${matchWin}W - ${matchLoss}L  ${mapDiff}`
      info.push(`\`${String(standing.league.placement).padStart(2, '0')}.\`  ${teamEmoji} \`${numberData}\``)
    }
    pages.push(info)

    if (stageIds.length > 0) {
      for (let i = 0; i < stageIds.length; i++) {
        const stageInfo = []
        const title = stageIds[i]
        const slug = stageSlugs[i]
        const pageTitle = `:trophy: __Overwatch League ${title} Standings__`
        for (let j = 0; j < CompetitorManager.competitors.size; j++) {
          const stageStanding = body.data[j].stages[slug]
          const matchWin = stageStanding.matchWin
          const matchLoss = stageStanding.matchLoss
          let points = stageStanding.comparisons[1].value

          if (points >= 0) {
            points = '+' + points
          }
          const placement = stageStanding.placement
          const teamEmoji = Emojis[body.data[j].abbreviatedName]
          const stagePlacement = `\`${String(placement).padStart(2, '0')}.\``
          const numberData = `${matchWin}W - ${matchLoss}L  ${points}`
          stageInfo.push(`${stagePlacement} ${teamEmoji} \`${numberData}\``)
        }
        stageInfo.sort()
        stageInfo.splice(8, 0, `--------------------------\n*Stage ${i + 1} Playoffs Cutoff*\n--------------------------`)
        pages.push(stageInfo)
        titles.push(pageTitle)
      }

      for (let i = 0; i < pages.length; i++) {
        pages[i].splice(0, 0, '*Command author can navigate stage/league\nstandings using the reactions below.*\n--------------------------')
      }

      embed.setDescription(pages[page])
      embed.setTitle(titles[titleNumber])
      const mess = embed.buildEmbed().getEmbed

      // https://github.com/MrSalta/discord-bot/blob/1d57bcfdd37cd74ff824ff1308cc5b9d6f6bfc5d/commands/destiny.js
      loading.then(message => message.edit(mess)).then(msg => {
        msg.react('🏆').then(async r => {
          for (let i = 0; i < stageIds.length; i++) {
            await msg.react(reactions[i])
          }
          const logoFilter = (reaction, user) => reaction.emoji.name === '🏆' & user.id === message.author.id
          const numberFilter = (reaction, user) => reactions.includes(reaction.emoji.name) & user.id === message.author.id

          const logo = msg.createReactionCollector(logoFilter)
          const numbers = msg.createReactionCollector(numberFilter)

          logo.on('collect', async r => {
            if (page === 0) {
              await r.remove(message.author.id)
              return
            }
            page = 0
            titleNumber = 0
            embed.setTitle(titles[titleNumber])
            embed.setDescription(pages[page])
            await r.remove(message.author.id)
            msg.edit(embed.buildEmbed().getEmbed)
          })

          numbers.on('collect', async r => {
            switch (r.emoji.name) {
              case '\u0031\u20E3':
                if (page === 1) {
                  await r.remove(message.author.id)
                  return
                }
                page = 1
                titleNumber = 1
                break
              case '\u0032\u20E3':
                if (page === 2) {
                  await r.remove(message.author.id)
                  return
                }
                page = 2
                titleNumber = 2
                break
              case '\u0033\u20E3':
                if (page === 3) {
                  await r.remove(message.author.id)
                  return
                }
                page = 3
                titleNumber = 3
                break
              case '\u0034\u20E3':
                if (page === 4) {
                  await r.remove(message.author.id)
                  return
                }
                page = 4
                titleNumber = 4
                break
            }
            embed.setTitle(titles[titleNumber])
            embed.setDescription(pages[page])
            await r.remove(message.author.id)
            msg.edit(embed.buildEmbed().getEmbed)
          })
        })
      })
    } else {
      embed.setDescription(info)
      embed.buildEmbed()
      loading.then(message => message.edit(embed.getEmbed))
    }
  }

  getAvailableStages () {
    const stages = []
    const currentTime = new Date().getTime()
    for (let i = 0; i < stageData.length; i++) {
      const stage = stageData[i]
      if (currentTime > stage.startDate) {
        stages.push(stage.name)
      }
    }
    return stages
  }

  getAvailableSlugs () {
    const slugs = []
    const currentTime = new Date().getTime()
    for (let i = 0; i < stageData.length; i++) {
      const stage = stageData[i]
      if (currentTime > stage.startDate) {
        slugs.push(stage.slug)
      }
    }
    return slugs
  }
}
module.exports = StandingsCommand
