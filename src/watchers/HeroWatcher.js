'use strict';

const { PlayerManager } = require('../models/owl_models');
const { Logger } = require('../utils');
class HeroWatcher {
    /**
     * Updates players heroes
     */
     async watchForHeroUpdates() {
        setInterval(async() => {
            Logger.custom('HERO', 'Watching for Hero updates')
            for (const player of PlayerManager.players.array()) {
                await PlayerManager.updatePlayedHeroes(player);
            }
        }, 100000)
    }
}
module.exports = HeroWatcher;