'use strict'

const { PlayerManager } = require('../models/owl_models')
const { Logger } = require('../utils')
class PlayerStatsWatcher {
  /**
     * Updates players heroes
     */
  async watchForPlayerStatUpdates () {
    setInterval(async () => {
      Logger.custom('PLAYER_STATS', 'Watching for Player stats updates')
      for (const player of PlayerManager.players.array()) {
        await PlayerManager.updatePlayerStats(player)
      }
      Logger.custom('PLAYER_STATS', 'Finished watching for Player stats updates')
    }, 2500000)
  }
}
module.exports = PlayerStatsWatcher
