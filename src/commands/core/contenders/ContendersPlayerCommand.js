const { Command, PachimariEmbed } = require('../../../models')
const HeroManager = require('../../../models/managers/HeroManager')
const { ContendersCompetitorManager } = require('../../../models/contenders')
const { MessageUtil, AlertUtil, Logger } = require('../../../utils')
const { Emojis } = require('../../../constants')
const accountTypes = require('../../../data/accounts.json')

/**
 * @class ContendersPlayerCommand
 * @description represents a command retrieving information about
 * a specific Overwatch Contenders Player
 */
class ContendersPlayerCommand extends Command {
  /**
     * Instantiates a new ContendersPlayerCommand
     * @constructor
     */
  constructor () {
    super()
    this.name = 'cplayer'
    this.description = 'Shows information about a specific Contenders player'
    this.usage = 'cplayer <player>'
    this.aliases = []
  }

  async execute (client, message, args) {
    const loading = message.channel.send(Emojis.LOADING)
    const playerArg = args[0].toLowerCase()
    let foundPlayer = null
    const competitors = ContendersCompetitorManager.contendersCompetitors.array()
    for (const competitor of competitors) {
      const players = competitor.players.array()
      for (const player of players) {
        if (player.name.toLowerCase() === playerArg) {
          foundPlayer = player
          break
        }
      }
    }

    if (foundPlayer === null) {
      loading.then(message => message.edit(AlertUtil.ERROR("Couldn't find that player. :C")))
      return
    }

    Logger.custom('CONTENDERS_PLAYER_COMMAND', `Loading player ${foundPlayer.name}`)
    let playerRoleMoji
    const team = ContendersCompetitorManager.contendersCompetitors.get(foundPlayer.competitorId)
    const teamEmoji = Emojis[team.abbreviatedName.toUpperCase()]
    if (foundPlayer.role) {
      playerRoleMoji = foundPlayer.role !== 'flex' ? Emojis[foundPlayer.role.toUpperCase()] : '💪'
    }
    const embed = new PachimariEmbed(client)
    embed.setColor(team.primaryColor)
    embed.setTitle(`${foundPlayer.givenName || ''} '**${foundPlayer.name}**' ${foundPlayer.familyName || ''}`)
    const info = []
    info.push(`${foundPlayer.nationality ? MessageUtil.getFlag(foundPlayer.nationality) : ''} ${teamEmoji} ${playerRoleMoji || ''} ${foundPlayer.playerNumber > 0 ? '**#' + foundPlayer.playerNumber + '**' : ''}`)
    info.push(foundPlayer.role ? `${MessageUtil.capitalize(foundPlayer.role)} player for ${team.name}` : `Player for ${team.name}`)
    embed.setDescription(info)
    embed.setThumbnail('https://bnetcmsus-a.akamaihd.net/cms/page_media/S02042JXNHF81515718127993.png')
    if (foundPlayer.heroes) {
      const newHeroArray = foundPlayer.heroes.map(hero => {
        const heroName = HeroManager.getHeroTitle(hero.name)
        const heroMoji = Emojis[hero.name.toUpperCase()]
        return `${heroMoji} ${heroName}`
      })
      embed.addFields('Top Heroes', newHeroArray, true)
    }
    if (foundPlayer.accounts) {
      const newAccountArray = foundPlayer.accounts.map(account => {
        let type = account.accountType
        for (let i = 0; i < accountTypes.length; i++) {
          const a = accountTypes[i]
          if (a.type === account.accountType) {
            type = a.title
          }
        }
        const accountEmoji = Emojis[type.toUpperCase()]
        const accountName = type
        return `${accountEmoji} [${accountName}](${account.value.replace(' ', '')})`
      })
      embed.addFields('Accounts', newAccountArray)
    }
    const mess = embed.buildEmbed().getEmbed
    loading.then(message => message.edit(mess))
  }
}
module.exports = ContendersPlayerCommand
