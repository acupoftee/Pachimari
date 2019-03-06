'use strict';

const CompetitorManager = require('./CompetitorManager');
const Endpoints = require('./Endpoints');
const { Collection } = require('discord.js');
const { JsonUtil } = require('../../utils');
const { Emojis } = require('../../constants');

/**
 * A colletion of standings
 * @type {Collection<number, string>}
 */
let teamStandings = new Collection();
/**
 * @class StandingsManager
 * @description represents a command that lists all Standings
 * in the Overwatch League
 */
class StandingsManager {

    constructor() {
        this._teamstandings = [];
    }

    /**
     * Returns standings
     * @returns {string[]} standings
     */
     static get info() {
        return teamStandings;
    }
    /**
     * Returns a refreshed list of standings;
     * @returns {StandingsManager} refreshed standings
     */
    async loadStandings(client) {
        //teamStandings = [];
        const body = await JsonUtil.parse(Endpoints.get('STANDINGS'));
        for (let i = 0; i < CompetitorManager.competitors.size; i++) {
            const standing = body.ranks.content[i];
            const matchWin = standing.records[0].matchWin;
            const matchLoss = standing.records[0].matchLoss;
            let mapDiff = standing.records[0].comparisons[1].value;
            if (mapDiff >= 0) {
                mapDiff = '+' + mapDiff;
            }
            const teamEmoji = Emojis[standing.competitor.abbreviatedName];
            const numberData = `${matchWin} - ${matchLoss} ${mapDiff}`;
            teamStandings.set(standing.competitor.id, `\`${('0' + standing.placement).slice(-2)}.\`  ${teamEmoji} \`${numberData}\``);
           // Logger.custom(`STANDING`, `Loaded standing for ${standing.competitor.abbreviatedName}`);
        }
        //console.log(teamStandings.length);
        // teamStandings.forEach(team => {
        //     this._teamstandings.push(team);
        // });
        return this;
    }
}
module.exports = StandingsManager;