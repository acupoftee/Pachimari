'use strict';

const { JsonUtil, Logger } = require('../utils');
const { Collection } = require('discord.js');
const Competitor  = require('./Competitor');

const competitors = new Collection();

/**
 * @description Loads and manages Competitors 
 */
class CompetitorManager {

    /**
     * @description Initalizes a CompetitorManager
     * @constructor
     */
    constructor() {

        /**
         * Array of Competitor Ids
         * @type {Array}
         * @private
         */
        this._competitors = [];
    }

    /**
     * Returns Overwatch League Competitors
     * @returns {Collection<string, Object>} competitors
     */
    static get competitors() {
        return competitors;
    }

    /**
     * Obtains all 2019 Overwatch League Competitors
     * @async
     */
    async getTeams() {
        const body = await JsonUtil.parse('https://api.overwatchleague.com/v2/teams?locale=en_US');
        body.data.forEach(competitor => {
            this._competitors.push(competitor.id);
        });
        return this;
    }

    /**
     * Loads all Competitors and stores them in a Collection
     * @async
     */
    async loadCompetitors() {
        for (let i = 0; i < this._competitors.length; i++) {
            const id = this._competitors[i];
            const body = await JsonUtil.parse(`https://api.overwatchleague.com/v2/teams/${id}?locale=en_US`);
            const data = body.data;

            let competitor = new Competitor(
                data.id, 
                data.divisionId,
                data.name, 
                data.abbreviatedName, 
                data.logo,
                data.logoName,
                data.location,
                data.primaryColor,
                data.secondaryColor,
                data.tertiaryColor,
                data.website,
                data.placement,
                data.matchWin,
                data.matchLoss,
                data.matchDraw
            );

            competitors.set(data.id, competitor);
            Logger.success(`Loaded ${data.id} ${data.name}`);
        }
    }
}
module.exports = CompetitorManager;