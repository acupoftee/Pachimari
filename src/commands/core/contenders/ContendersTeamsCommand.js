'use strict'

const { Command, PachimariEmbed } = require('../../../models')
const { ContendersCompetitorManager } = require('../../../models/contenders')
const { AlertUtil, Logger } = require('../../../utils')
const { Emojis } = require('../../../constants')

/**
 * @class ContendersTeamsCommand
 * @description represents a command that lists all Competitors
 * in Overwatch Contenders
 */
class ContendersTeamsCommand extends Command {
  /**
     * Instantiates a new ContendersTeamsComamand
     * @constructor
     */
  constructor () {
    super()
    this.name = 'contenders'
    this.description = 'Lists all Overwatch Contenders teams'
    this.usage = 'contenders'
    this.aliases = []
  }

  async execute (client, message, args) {
    const msg = message.channel.send(Emojis.LOADING)
    // msg.then(async message => message.edit(await (this.buildMessage(client, args))))
    let pages = []
    let page = 0
    let currentRegion = 'Americas'
    const embed = new PachimariEmbed(client)
    const regions = {}

    const reactions = [
      '🌎',
      '🌏',
      '🇪🇺',
      '🇨🇳',
      '🇰🇷',
      '🇦🇺'
    ]

    ContendersCompetitorManager.contendersCompetitors.forEach(competitor => {
      const teamEmoji = Emojis[competitor.abbreviatedName.toUpperCase()]
      const key = this.getRegionEmoji(competitor.region)
      if (!regions[key]) {
        regions[key] = []
      }
      regions[key].push(`${teamEmoji} ${competitor.name}`)
    })

    pages = [regions.americas,
      regions.asia,
      regions.eu,
      regions.china,
      regions.korea,
      regions.australia
    ]

    embed.setTitle('__Overwatch Contenders Teams__')
    embed.setDescription(`*${currentRegion}*:\n${pages[page].join('\n')}`)
    embed.setThumbnail('http://esportsjunkie.com/wp-content/uploads/2018/02/Overwatch-Contenders-New-Logo.png')
    embed.setColor('#afe915')
    embed.setFooter(`Page ${page + 1} of ${pages.length}. Only command author can turn pages.`)

    const mess = embed.buildEmbed().getEmbed

    msg.then(message => message.edit(mess)).then(tabs => {
      tabs.react('🌎').then(async r => {
        await tabs.react('🌏')
        await tabs.react('🇪🇺')
        await tabs.react('🇨🇳')
        await tabs.react('🇰🇷')
        await tabs.react('🇦🇺')
      })
      const globeFilter = (reaction, user) => reactions.includes(reaction.emoji.name) & user.id === message.author.id

      const tab = tabs.createReactionCollector(globeFilter)

      tab.on('collect', async r => {
        // console.log(r.emoji.name)
        switch (r.emoji.name) {
          case '🌎':
            if (page === 0) {
              await r.remove(message.author.id)
              return
            }
            currentRegion = 'Americas'
            page = 0
            break
          case '🌏':
            if (page === 1) {
              await r.remove(message.author.id)
              return
            }
            currentRegion = 'Pacific'
            page = 1
            break
          case '🇪🇺':
            if (page === 2) {
              await r.remove(message.author.id)
              return
            }
            currentRegion = 'Europe'
            page = 2
            break
          case '🇨🇳':
            if (page === 3) {
              await r.remove(message.author.id)
              return
            }
            currentRegion = 'China'
            page = 3
            break
          case '🇰🇷':
            if (page === 4) {
              await r.remove(message.author.id)
              return
            }
            currentRegion = 'Korea'
            page = 4
            break
          case '🇦🇺':
            if (page === 5) {
              await r.remove(message.author.id)
              return
            }
            currentRegion = 'Australia'
            page = 5
            break
        }
        embed.setDescription(`*${currentRegion}*:\n${pages[page].join('\n')}`)
        embed.setFooter(`Page ${page + 1} of ${pages.length}. Only command author can turn pages.`)
        await r.remove(message.author.id)
        tabs.edit(embed.buildEmbed().getEmbed)
      })
    })
  }

  getRegionEmoji (initials) {
    switch (initials) {
      case 'OC':
        return 'australia'
      case 'AS':
        return 'asia'
      case 'CN':
        return 'china'
      case 'KR':
        return 'korea'
      case 'NA West':
      case 'NA East':
      case 'SA':
        return 'americas'
      case 'EU':
        return 'eu'
    }
  }
}
module.exports = ContendersTeamsCommand
