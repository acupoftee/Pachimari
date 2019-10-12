// 'use strict'

// const { Command, PachimariEmbed } = require('../../../models')
// const { CompetitorManager, Endpoints, MapManager } = require('../../../models/owl_models')
// const { JsonUtil, AlertUtil, Logger } = require('../../../utils')
// const { Emojis } = require('../../../constants')

// class MapCommand extends Command {
//   constructor () {
//     super()
//     this.name = 'mapstats'
//     this.description = 'Shows map win rates for a specific OWL team'
//     this.usage = 'mapstats <team> [mapname]'
//     this.aliases = []
//   }

//   async execute (client, message, args) {
//     // 1. send loading message
//     // 2. read team name
//     // 3. read map name
//     // 4. count map wins and losses
//     // 5. calculate winrate
//     // 6. build embed w/ map emoji and image

//     // send loading message
//     const loading = message.channel.send(Emojis.LOADING)
//     const mapWinRate = 0
//     const mapWins = 0; const mapLosses = 0
//     const map = args[0]
//     const team = CompetitorManager.competitors.get(args[0])

//     loading.then(message => message.edit(
//       message.channel.send(`Loading map win rate for ${map}`)))
//   }
// }
// module.exports = MapCommand
