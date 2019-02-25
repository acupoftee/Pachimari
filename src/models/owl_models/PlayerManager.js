'use strict';

const { JsonUtil, Logger } = require('../../utils');
const { Collection } = require('discord.js');
const CompetitorManager  = require('./CompetitorManager');
const Player = require('./Player');
const Account = require('./Account');
const accountTypes = require('../../data/accounts.json');
const Endpoints = require('./Endpoints');
const heroData = require('../../data/heroes.json');

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
            const heroArray = [];

            if (data.attributes.heroes !== undefined) {
                heroData.forEach(hero => {
                    if (data.attributes.heroes.includes(hero.key)) {
                        heroArray.push(hero.title);
                    }
                })   
            }
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
                heroArray,
                body.data.stats.all.eliminations_avg_per_10m,
                body.data.stats.all.deaths_avg_per_10m,
                body.data.stats.all.hero_damage_avg_per_10m,
                body.data.stats.all.healing_avg_per_10m,
                body.data.stats.all.ultimates_earned_avg_per_10m,
                body.data.stats.all.final_blows_avg_per_10m,
                body.data.stats.all.time_played_total
            );

            data.accounts.forEach(acc => {
                let type = acc.accountType;
                for (let i = 0; i < accountTypes.length; i++) {
                    const a = accountTypes[i];
                    if (a.type === acc.accountType) {
                        type = a.title;
                    }
                }
                let account = new Account(acc.id, type, acc.value);
                player.accounts.set(acc.id, account);
            })
            const competitor = CompetitorManager.competitors.get(data.teams[0].team.id);
            competitor.players.set(data.id, player);
            players.set(data.id, player);
            Logger.custom(`PLAYER`, `Loaded player ${data.id} ${data.name}`);
        }
    }

    /**
     * Finds a Player ID by name
     * @param {string} val the player's name
     * @returns {number} the Player's ID
     */
    static locatePlayer(val) {
        const key = val.toLowerCase();
        let id = 0;
        players.forEach(player => {
            if (player.name.toLowerCase() === key) {
                id = player.id;
            }
        });
        return id;
    }
}
module.exports = PlayerManager;