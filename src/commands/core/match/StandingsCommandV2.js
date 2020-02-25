'use strict'

const $ = require('cheerio')
const { Command, PachimariEmbed } = require('../../../models')
const { JsonUtil, Logger } = require('../../../utils')
const { Emojis } = require('../../../constants')

/**
 * @class StandingsCommand
 * @description represents a command that lists all Competitors
 * Standings in the Overwatch League
 */
class StandingsCommandv2 extends Command {
  /**
     * Instantiates a new StandingsCommandV2
     * @constructor
     */
  constructor() {
    super()
    this.name = 'standings'
    this.description = 'Shows the current standings for this season'
    this.usage = 'standings [playoffs]'
    this.aliases = []
  }

  async execute(client, message, args) {
    const loading = message.channel.send(Emojis.LOADING)
    const info = []
    const embed = new PachimariEmbed(client)
    embed.setTitle(':trophy: __Overwatch League Standings__')

    Logger.custom('STANDINGS_COMMAND', 'Loading standings data.')

    const body = await JsonUtil.parse(
      'https://overwatchleague.com/en-us/standings',
      {
        'Access-Control-Allow-Origin': `${process.env.PORT || 'http://localhost:3000'}`
      }
    )

    const standingsText = $('#__NEXT_DATA__', body)[0].children[0].data
    const standingsData = JSON.parse(standingsText)
    const standings = standingsData.props.pageProps.blocks[1].standings.tabs[0].tables[0].teams

    for (const team of standings) {
      const standing = team.rank
      const matchWin = team.w
      const matchLoss = team.l
      const diff = team.diff
      const teamEmoji = Emojis[team.teamAbbName]
      const numberData = `${matchWin}W - ${matchLoss}L ${diff.padStart(2, ' ')}`
      info.push(`\`${String(standing).padStart(2, '0')}.\`  ${teamEmoji} \`${numberData}\``)
    }

    embed.setDescription(info)
    embed.buildEmbed()
    loading.then(message => message.edit(embed.getEmbed))
  }
}
module.exports = StandingsCommandv2
