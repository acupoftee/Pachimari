'use strict';

const { JsonUtil, Logger } = require('../utils');
const { Collection } = require('discord.js');
const CompetitorManager  = require('./CompetitorManager');
const Player = require('./Player');
const Account = require('./Account');
const accountTypes = require('../data/accounts.json');
const Endpoints = require('./Endpoints');

/**
 * A collection of Players
 * @type {Collection<number, Player}
 */
const players = new Collection();

class PlayerManager {
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
     * Obtains all 2019 Overwatch League Players
     * @async
     */
    async getPlayers() {
        const playerBody = await JsonUtil.parse(Endpoints.get('PLAYERS'));
        playerBody.content.forEach(player => {
            this._players.push(player.id);
        });

        return this;
    }

    /**
     * Loads all Players and stores them in a Collection
     * @async
     */
    async loadPlayers() {
        for (let i = 0; i < this._players.length; i++) {
            const id = this._players[i];
            const body = await JsonUtil.parse(Endpoints.get('PLAYER', id));
            const data = body.data.player;

            let player = new Player(
                data.id,
                data.teams[0].team.id,
                data.attributes.player_number,
                data.name,
                data.homeLocation,
                data.familyName,
                data.givenName,
                data.nationality,
                data.headshot,
                data.attributes.role,
                data.heroes
            );

            const competitor = CompetitorManager.competitors.get(data.teams[0].team.id);
            competitor.players.set(data.id, player);
            players.set(data.id, player);
            Logger.custom(`PLAYER`, `Loaded player ${data.id}`);
        }
    }
}
module.exports = PlayerManager;