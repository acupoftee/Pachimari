'use strict'

const { PlayerManager } = require('../models/owl_models')
const { Logger } = require('../utils')
class HeroWatcher {
  /**
   * Update's player's hero stats
   */
  async watchForHeroUpdates () {
    setInterval(async () => {
      Logger.custom('HERO', 'Watching for Hero updates')
      for (const player of PlayerManager.players.array()) {
        await PlayerManager.updatePlayedHeroes(player)
      }
      Logger.custom('HERO', 'Finished watching for Hero updates')
    }, 1800000)
  }
}
module.exports = HeroWatcher
