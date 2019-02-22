'use strict';

const { JsonUtil, Logger } = require('../utils');
const { Collection } = require('discord.js');
const Competitor  = require('./Competitor');
const teamNames = require('../data/teamnames.json');
const divisions = require('../data/divisions.json');
const Endpoints = require('./Endpoints');

/**
 * A collection of Competitors
 * @type {Collection<number, Competitor}
 */
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
        //const body = await JsonUtil.parse('https://api.overwatchleague.com/v2/teams?locale=en_US');
        const body = await JsonUtil.parse(Endpoints.get('COMPETITORS'));
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
            const body = await JsonUtil.parse(Endpoints.get('COMPETITOR', id));
            const data = body.data;

            let competitor = new Competitor(
                data.id, 
                data.divisionId,
                data.name, 
                data.abbreviatedName, 
                data.logo.main.png,
                data.logoName,
                data.location,
                data.colors.primary.color,
                data.colors.secondary.color,
                data.colors.tertiary.color,
                data.website,
                data.placement,
                data.records.matchWin,
                data.records.matchLoss,
                data.records.matchDraw
            );
            
            competitors.set(data.id, competitor);
            Logger.success(`Loaded ${data.id} ${data.name}`);
        }
    }

    /**
     * Finds a Competitor ID by name
     * @param {string} val 
     * @returns the Competitor's ID
     */
    static locateTeam(val) {
        const key = val.toLowerCase();
        for (let i = 0; i < teamNames.length; i++) {
            const competitor = teamNames[i];
            const id = competitor.id;

            // return id if keys are equal
            if (key == id) {
                return id;
            }

            // return id if names are equal
            for (let j = 0; j < competitor.values.length; j++) {
                const value = competitor.values[j];
                if (key == value) {
                    return id;
                }
            }
        }
    }

    /**
     * Convert a division from ID to name or vice-versa.
     * @static
     * @param {String|number} division Name or ID of the divison.
     * @returns {String|number}
     */
    static getDivision(division) {
        for (let i = 0; i < divisions.length; i++) {
            const div = divisions[i];
            if (typeof division === 'string') {
                if (div.values.includes(division)) {
                    return div.id;
                }
            } else if (typeof division === 'number') {
                let long = div.values[0];
                if (division == div.id) {
                    return long.charAt(0).toUpperCase() + long.slice(1);
                }
            }
        }
    }
}
module.exports = CompetitorManager;