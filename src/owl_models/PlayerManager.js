'use strict';

const { JsonUtil, Logger } = require('../utils');
const { Collection } = require('discord.js');
const Player  = require('./Player');
const CompetitorManager = require('./CompetitorManager')
const Endpoints = require('./Endpoints');

/**
 * A collection of Players
 * @type {Collection<number, Player}
 */
const players = new Collection();

/**
 * @class PlayerManager
 * @description Loads and manages Players
 */
class PlayerManager {

    /**
     * @description Initalizes a PlayerManager
     * @constructor
     */
    constructor() {
        /**
         * Array of Player IDs
         * @type {Array}
         * @private
         */
        this._players = [];
    }

    /**
     * Returns Overwatch League Team Players
     * @returns {Collection<string, Object>} players
     */
    static get players() {
        return players;
    }

     /**
     * Obtains all Players for an Overwatch League Team
     * @async
     */
    async getPlayers() {
        const body = await JsonUtil.parse(Endpoints.get('PLAYERS'));
        body.content.forEach(player => {
            this._players.push(player.id);
        });
        return this;
    }

    /**
     * Loads all Overwatch League Team players
     */
    async loadPlayers() {
        for (let i = 0; i < this._players.length; i++) {
            const id = this._players[i];
            const body = await JsonUtil.parse(Endpoints.get('PLAYER', id));
            const data = body.data.player;

            let player = new Player(
                data.teams[0].team.id,
                data.competitorId,
                data.attributes.playerNumber,
                data.name,
                data.homeLocation, 
                data.familyName,
                data.givenName,
                data.nationality,
                data.headshot,
                data.attributes.role,
                data.attributes.heroes
            );
            const competitor = CompetitorManager.competitors.get(data.teams[0].team.id);
            competitor.players.set(data.id, player);
            players.set(data.id, player);
            Logger.success(`Loaded player ${data.id}`);
        }
    }
}
module.exports = PlayerManager;