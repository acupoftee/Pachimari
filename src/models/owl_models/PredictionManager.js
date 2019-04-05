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
                let row = await Queries.getPredicitionBasedOnMatch(_matchId);
                console.log(row[0].first_team);
                await Queries.addPredictionResults(row[0].first_team, row[0].first_score, 
                    row[0].second_team, row[0].second_score, _matchId, body.status);
                // await Queries.deletePredictions(_matchId);
               
            }
        }
    }

    watch() {
        setInterval(async() => { await this.getMatches() }, 10000);
    }
}
module.exports = PredictionManager;