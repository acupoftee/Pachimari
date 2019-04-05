'use strict';

const CompetitorManager = require('./CompetitorManager');
const Endpoints = require('./Endpoints');
const { JsonUtil } = require('../../utils');

class MatchManager {
    static async getMatchBetweenTeams(firstId, secondId) {
        let scores = [];
        const body = await JsonUtil.parse(Endpoints.get("SCHEDULE"));
        for (const _stage of body.data.stages) {
            for (const week of _stage.weeks) {
                for (const _match of week.matches) {
                    let home = CompetitorManager.competitors.get(CompetitorManager.locateTeam(_match.competitors[0].abbreviatedName));
                    let away = CompetitorManager.competitors.get(CompetitorManager.locateTeam(_match.competitors[1].abbreviatedName));
                    if (((home.id === firstId) && (away.id === secondId)) || ((away.id === firstId) && (home.id === secondId))) {
                           scores.push(_match.scores[0].value);
                           scores.push(_match.scores[1].value);
                           break;
                    }
                }
            }
        }
        console.log(scores);
        return scores;
    }
}
module.exports = MatchManager;