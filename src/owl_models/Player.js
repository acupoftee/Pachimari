'use strict';
const { Collection } = require('discord.js')

/**
 * Represents a Player object.
 * https://api.overwatchleague.com/players/TEAM_ID?
 */
class Player {
    /**
     * Instantiates a new Player object.
     * @constructor
     * @param {number} id Player's ID
     * @param {number} competitorId Player's Competitor ID
     * @param {String} name Player's Battle.net Tag
     * @param {String} homeLocation a Player's hometown
     * @param {String} famiyName Player's last name
     * @param {String} givenName Player's given name
     * @param {String} nationality Player's nationality
     * @param {String} headshot Player's headshot URL
     * @param {String} role Player's Overwatch role.
     */
    constructor(id, competitorId, name, homeLocation, 
        famiyName, givenName, nationality, headshot, role) {
            this._id = id;
            this._competitorId = competitorId;
            this._name = name;
            this._homeLocation = homeLocation;
            this._familyName = familyName;
            this._givenName = givenName;
            this._nationality = nationality;
            this._headshot = headshot;
            this._role = role;

            /**
             * A Collection of Accounts
             * @type {Collection<string, Object}
             * @private
             */
            this._accounts = new Collection();
    }

    /**
     * Returns a Player's ID
     * @type {number}
     * @returns player's team id
     */
    get id() {
        return this._id;
    }

    /**
     * Returns a Player's Competitor ID 
     * @type {number}
     * @returns player's competitive id
     */
    get competitorId() {
        return this._competitorId;
    }

    /**
     * Returns a Player's Battle.net name
     * @type {String}
     * @returns player's name
     */
    get name() {
        return this._name;
    }

    /**
     * Returns a Player's home location
     * @type {String}
     * @returns player's home location
     */
    get homeLocation() {
        return this._homeLocation;
    }

    /**
     * Returns a Player's family name (last name)
     * @type {String}
     * @returns player's family name
     */
    get familyName() {
        return this._familyName;
    }

    /**
     * Returns a Player's given name
     * @type {String}
     * @returns player's given name
     */
    get givenName() {
        return this._givenName;
    }

    /**
     * Returns a Player's nationality
     * @type {String}
     * @returns player's nationality
     */
    get nationality() {
        return this._nationality;
    }

    /**
     * Returns a Player's headshot URL
     * @type {String}
     * @returns player's headshot URL
     */
    get headshot() {
        return this._headshot;
    }

    /**
     * Returns a Player's role
     * @type {String}
     * @returns {String} player's role
     */
    get role() {
        return this._role;
    }
}
module.exports = Player;