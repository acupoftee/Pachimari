'use strict'

const { Command, PachimariEmbed } = require('../../../models')
const { CompetitorManager, Endpoints, MapManager } = require('../../../models/owl_models')
const { JsonUtil, AlertUtil, Logger } = require('../../../utils')
const { Emojis } = require('../../../constants')
const momentTimezone = require('moment-timezone')

class MatchCommand extends Command {
  constructor () {
    super()
    this.name = 'matches'
    this.description = 'Shows information about team matches'
    this.usage = 'matches <first_team> [second_team]'
    this.aliases = []
  }

  async execute (client, message, args) {
    let stageWeek = ''
    const loading = message.channel.send(Emojis.LOADING)
    const pages = []; let matches = []; const titles = []; let futureMatches = []
    let page = 1; let title = 1
    let header

    let found = false; let pending = true
    const embed = new PachimariEmbed(client)

    if (args.length < 1 || args.length > 2) {
      loading.then(message => message.edit(AlertUtil.ERROR("Sorry, I couldn't find matches :C Make sure to add two!")))
      return
    } else if (args.length === 1) {
      const firstTeam = CompetitorManager.competitors.get(CompetitorManager.locateTeam(args[0]))
      if (firstTeam === undefined) {
        loading.then(message => message.edit("Sorry, I couldn't find that team."))
        return
      }
      embed.setTitle(`${Emojis[firstTeam.abbreviatedName.toUpperCase()]} ${firstTeam.name} Matches`)
      embed.setColor(firstTeam.primaryColor)
      const logo = firstTeam.abbreviatedName.toUpperCase() === 'CDH' ? firstTeam.altDark : firstTeam.logo
      embed.setThumbnail(logo)
      loading.then(message => message.edit(`${Emojis.LOADING} Loading matches for ${firstTeam.name}`))
      Logger.custom('MATCH_COMMAND', `Loading matches for **${firstTeam.name}**`)
      const body = await JsonUtil.parse(Endpoints.get('SCHEDULE'))
      for (const _stage of body.data.stages) {
        for (const week of _stage.weeks) {
          stageWeek = `${_stage.name} - ${week.name}`
          for (const _match of week.matches) {
            if (_match.competitors[0] == null || _match.competitors[1] == null ||
                            _match.competitors[0].abbreviatedName === undefined || _match.competitors[1].abbreviatedName === undefined) {
              continue
            }
            const home = CompetitorManager.competitors.get(CompetitorManager.locateTeam(_match.competitors[0].abbreviatedName))
            const away = CompetitorManager.competitors.get(CompetitorManager.locateTeam(_match.competitors[1].abbreviatedName))
            if (home === undefined || away === undefined) {
              continue
            }
            const homeMatchScore = _match.scores[0].value
            const awayMatchScore = _match.scores[1].value
            // console.log(away);
            // console.log(home);

            if ((home.id === firstTeam.id) || ((away.id === firstTeam.id))) {
              found = true
              if (_match.status === 'CONCLUDED') {
                for (let i = 0; i < _match.games.length; i++) {
                  const mapGuid = _match.games[i].attributes.mapGuid
                  const mapName = await MapManager.getMap(mapGuid)
                  const mapType = await MapManager.getMapType(mapGuid)
                  const homeMapScore = _match.games[i].points === undefined ? 0 : _match.games[i].points[0]
                  const awayMapScore = _match.games[i].points === undefined ? 0 : _match.games[i].points[1]
                  let mapStr = `${Emojis[mapType.toUpperCase()]} ${mapName}: ${mapType}\n${
                                        Emojis[home.abbreviatedName.toUpperCase()]} ${homeMapScore} - ${awayMapScore} ${
                                        Emojis[away.abbreviatedName.toUpperCase()]}\n`
                  if (i === 0) {
                    const title = `${Emojis[home.abbreviatedName.toUpperCase()]} __${home.name} vs. ${away.name}__ ${Emojis[away.abbreviatedName.toUpperCase()]}`
                    titles.push(title)
                    header = `Match Date: ${momentTimezone(_match.startDateTS).tz('America/Los_Angeles').format('dddd. MMM Do, YYYY')}
                                        ${stageWeek}\n
                                        Match Score:\n${Emojis[home.abbreviatedName.toUpperCase()]} ${homeMatchScore} - ${
                                            awayMatchScore} ${Emojis[away.abbreviatedName.toUpperCase()]}\n\n__**Maps**__\n`
                    mapStr = header + mapStr
                  }
                  matches.push(mapStr)
                  pending = false
                }
              } else {
                header = `${Emojis[home.abbreviatedName.toUpperCase()]} **${home.name} vs. ${away.name}** ${Emojis[away.abbreviatedName.toUpperCase()]}
                                Match Date: ${momentTimezone(_match.startDateTS).tz('America/Los_Angeles').format('dddd. MMM Do, YYYY')}\n${stageWeek}\n`
                futureMatches.push(header)
                pending = true
              }
            }
            if (matches.length > 0) {
              pages.push(matches)
              matches = []
            }
          }
        }
        if (pending) {
          const title = `__Upcoming ${firstTeam.name} ${_stage.name} Matches__`
          titles.push(title)
        }
        if (futureMatches.length > 0) {
          pages.push(futureMatches)
          futureMatches = []
        }
      }
    } else if (CompetitorManager.locateTeam(args[0]) === CompetitorManager.locateTeam(args[1])) {
      loading.then(message => message.edit(AlertUtil.ERROR(':C Make sure to use two different teams!')))
      return
    } else {
      const firstTeam = CompetitorManager.competitors.get(CompetitorManager.locateTeam(args[0]))
      const secondTeam = CompetitorManager.competitors.get(CompetitorManager.locateTeam(args[1]))

      if (!firstTeam || !secondTeam) {
        loading.then(message => message.edit("Sorry, I couldn't find that team."))
        return
      }
      loading.then(message => message.edit(`${Emojis.LOADING} Loading matches for **${firstTeam.name}** vs. **${secondTeam.name}**`))
      Logger.custom('MATCH_COMMAND', `Loading matches for ${firstTeam.name} vs. ${secondTeam.name}`)
      embed.setTitle(`${Emojis[firstTeam.abbreviatedName.toUpperCase()]} ${firstTeam.name} vs ${secondTeam.name} ${Emojis[secondTeam.abbreviatedName.toUpperCase()]}`)
      embed.setColor(firstTeam.primaryColor)
      const logo = firstTeam.abbreviatedName.toUpperCase() === 'CDH' ? firstTeam.altDark : firstTeam.logo
      embed.setThumbnail(logo)
      const body = await JsonUtil.parse(Endpoints.get('SCHEDULE'))
      for (const _stage of body.data.stages) {
        for (const week of _stage.weeks) {
          stageWeek = `${_stage.name} - ${week.name}`
          for (const _match of week.matches) {
            if (!_match.competitors[0] || !_match.competitors[1] ||
                            !_match.competitors[0].abbreviatedName || !_match.competitors[1].abbreviatedName) {
              continue
            }
            const home = CompetitorManager.competitors.get(CompetitorManager.locateTeam(_match.competitors[0].abbreviatedName))
            const away = CompetitorManager.competitors.get(CompetitorManager.locateTeam(_match.competitors[1].abbreviatedName))
            if (!home || !away) {
              continue
            }
            const homeMatchScore = _match.scores[0].value
            const awayMatchScore = _match.scores[1].value
            if (((home.id === firstTeam.id) && (away.id === secondTeam.id)) || ((away.id === firstTeam.id) && (home.id === secondTeam.id))) {
              found = true
              if (_match.status === 'CONCLUDED') {
                for (let i = 0; i < _match.games.length; i++) {
                  const mapGuid = _match.games[i].attributes.mapGuid
                  const mapName = await MapManager.getMap(mapGuid)
                  const mapType = await MapManager.getMapType(mapGuid)
                  const homeMapScore = _match.games[i].points === undefined ? 0 : _match.games[i].points[0]
                  const awayMapScore = _match.games[i].points === undefined ? 0 : _match.games[i].points[1]
                  let mapStr = `${Emojis[mapType.toUpperCase()]} ${mapName}: ${mapType}\n${
                                        Emojis[home.abbreviatedName.toUpperCase()]} ${homeMapScore} - ${awayMapScore} ${
                                        Emojis[away.abbreviatedName.toUpperCase()]}\n`
                  if (i === 0) {
                    const title = `${Emojis[home.abbreviatedName.toUpperCase()]} __${home.name} vs. ${away.name}__ ${Emojis[away.abbreviatedName.toUpperCase()]}`
                    titles.push(title)
                    const header = `Match Date: ${momentTimezone(_match.startDateTS).tz('America/Los_Angeles').format('dddd. MMM Do, YYYY')}
                                            ${stageWeek}\n
                                            Match Score:\n${Emojis[home.abbreviatedName.toUpperCase()]} ${homeMatchScore} - ${
                                            awayMatchScore} ${Emojis[away.abbreviatedName.toUpperCase()]}\n\n__**Maps**__\n`
                    mapStr = header + mapStr
                  }
                  matches.push(mapStr)
                }
              } else {
                const title = `${Emojis[home.abbreviatedName.toUpperCase()]} __${home.name} vs. ${away.name}__ ${Emojis[away.abbreviatedName.toUpperCase()]}`
                titles.push(title)
                let header = `Match Date: ${momentTimezone(_match.startDateTS).tz('America/Los_Angeles').format('dddd. MMM Do, YYYY')}\n${stageWeek}`
                if (_match.games.length > 0) {
                  header = header + '\n\n__**Maps**__\n'
                  for (let j = 0; j < _match.games.length; j++) {
                    const mapGuid = _match.games[j].attributes.mapGuid
                    const mapName = await MapManager.getMap(mapGuid)
                    const mapType = await MapManager.getMapType(mapGuid)
                    const mapStr = `${Emojis[mapType.toUpperCase()]} ${mapName}: ${mapType}\n`
                    header = header + mapStr
                  }
                }
                matches.push(header)
              }
            }
          }
          if (matches.length > 0) {
            pages.push(matches)
            matches = []
          }
        }
      }
    }

    if (!found) {
      loading.then(message => message.edit(AlertUtil.ERROR("Sorry, I couldn't find that match :C")))
      return
    }
    embed.setDescription(pages[page - 1])
    embed.setTitle(titles[title - 1])
    // console.log(titles);

    if (pages.length > 1) {
      embed.setFooter(`Page ${page} of ${pages.length}. Only command author can turn pages.`)
      const mess = embed.buildEmbed().getEmbed
      loading.then(message => message.edit(mess)).then(msg => {
        msg.react('⬅').then(r => {
          msg.react('➡')

          const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅' && user.id === message.author.id
          const forwardFilter = (reaction, user) => reaction.emoji.name === '➡' && user.id === message.author.id

          const backwards = msg.createReactionCollector(backwardsFilter, { time: 100000 })
          const forwards = msg.createReactionCollector(forwardFilter, { time: 100000 }) // { time: 100000 }

          backwards.on('collect', async r => {
            if (page === 1) {
              await r.remove(message.author.id)
              return
            }
            page--
            if (args.length === 1) {
              title--
              embed.setTitle(titles[title - 1])
            }
            embed.setDescription(pages[page - 1])
            embed.setFooter(`Page ${page} of ${pages.length}. Only command author can turn pages`)
            await r.remove(message.author.id)
            msg.edit(embed.buildEmbed().getEmbed)
          })

          forwards.on('collect', async r => {
            if (page === pages.length) {
              await r.remove(message.author.id)
              return
            }
            page++
            if (args.length === 1) {
              title++
              embed.setTitle(titles[title - 1])
            }
            embed.setDescription(pages[page - 1])
            embed.setFooter(`Page ${page} of ${pages.length}. Only command author can turn pages`)
            await r.remove(message.author.id)
            msg.edit(embed.buildEmbed().getEmbed)
          })
        })
      })
    } else {
      const mess = embed.buildEmbed().getEmbed
      loading.then(message => message.edit(mess))
    }
  }
}
module.exports = MatchCommand
