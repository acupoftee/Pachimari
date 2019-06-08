'use strict';

const { CompetitorManager, PlayerManager, Endpoints } = require('../models/owl_models');
const { Logger, JsonUtil } = require('../utils');
class RosterWatcher {
    
    /**
     * Updates players heroes
     */
     async watchForTeamSwaps() {
        setInterval(async() => {
            Logger.custom('ROSTER', 'Watching for roster updates')
            for (const player of PlayerManager.players.array()) {
                const playerBody = await JsonUtil.parse(Endpoints.get('PLAYER', player.id))
                const latestCompetitor = playerBody.data.player.teams[0].team.id;

                if (latestCompetitor !== player.competitorId) {
                    const previousCompetitor = CompetitorManager.competitors.get(player.competitorId);
                    const competitor = CompetitorManager.competitors.get(latestCompetitor);
                    competitor.players.set(latestCompetitor, player);
                    competitor.players.delete(previousCompetitor);
                    player.setCompetitorId(latestCompetitor);
                    Logger.custom('ROSTER_UPDATE', `updated team for ${player.name} to ${CompetitorManager.competitors.get(latestCompetitor)}`)
                }
            }
            Logger.custom('ROSTER', `Finished watching for roster updates`);
        }, 300000)
    }
}
module.exports = RosterWatcher;