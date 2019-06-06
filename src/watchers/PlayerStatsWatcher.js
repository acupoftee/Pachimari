'use strict';

const { PlayerManager } = require('../models/owl_models');
const { Logger } = require('../utils');
class PlayerStatsWatcher {
    /**
     * Updates players heroes
     */
     async watchForPlayerStatUpdates() {
        setInterval(async() => {
            Logger.custom('PLAYER_STATS', 'Watching for Player stats updates');
            for (const player of PlayerManager.players.array()) {
                await PlayerManager.updateStats(player);
            }
        }, 2500000)
    }
}
module.exports = PlayerStatsWatcher;