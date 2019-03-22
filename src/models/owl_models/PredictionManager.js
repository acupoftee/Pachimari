'use strict';

const { JsonUtil, Logger } = require('../../utils');
const Endpoints = require('./Endpoints');
const Queries = require('../../db/Queries');

class PredictionManager {
    // get a SET of match IDS
     async getMatches() {
        Logger.info("Watching for API Updates.");
        let ids = await Queries.getDistinctMatches();
        let matchIds = [];
        for (const matchId of ids) {
            matchIds.push(matchId.match_id);
        }
        console.log(matchIds);
        for (const _matchId of matchIds) {
            const body = await JsonUtil.parse(Endpoints.get("MATCH", _matchId));
            if (body.status === "CONCLUDED") {
                await Queries.deletePredictions(_matchId);
            }
        }
    }

    watch() {
        setInterval(async() => { await this.getMatches() }, 10000);
    }
}
module.exports = PredictionManager;