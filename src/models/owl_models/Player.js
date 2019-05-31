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
     * @param {number} playerNumber Player's jersey number
     * @param {String} name Player's Battle.net Tag
     * @param {String} homeLocation a Player's hometown
     * @param {String} familyName Player's last name
     * @param {String} givenName Player's given name
     * @param {String} nationality Player's nationality
     * @param {String} headshot Player's headshot URL
     * @param {String} role Player's Overwatch role.
     * @param {String[]} heroes Player's Overwatch heroes.
     * @param {number} eliminations Player's elimination average per 
     * 10 minutes
     * @param {number} deaths Player's death average per 
     * 10 minutes
     * @param {number} heroDamage Player's hero damage average per 
     * 10 minutes
     * @param {number} healing Player's healing average per 
     * 10 minutes
     * @param {number} ultimates Player's ultimate average per 
     * 10 minutes
     * @param {number} finalBlows Player's final blow average per 
     * 10 minutes
     * @param {number} timePlayed Player's total time played 
     */
    constructor(id, competitorId, playerNumber, name, homeLocation, 
        familyName, givenName, nationality, headshot, role, heroes,
        eliminations, deaths, heroDamage, healing, ultimates,
        finalBlows, timePlayed) { 
            this._id = id;
            this._competitorId = competitorId;
            this._playerNumber = playerNumber;
            this._name = name;
            this._homeLocation = homeLocation;
            this._givenName = givenName,
            this._familyName = familyName;
            this._nationality = nationality;
            this._headshot = headshot;
            this._role = role;
            this._heroes = heroes;
            this._eliminations = eliminations;
            this._deaths = deaths;
            this._heroDamage = heroDamage;
            this._healing = healing;
            this._ultimates = ultimates;
            this._finalBlows = finalBlows;
            this._timePlayed = timePlayed;

            /**
             * A Collection of Accounts
             * @type {Collection<string, Account>}
             * @private
             */
            this._accounts = new Collection();

            /**
             * A Collection of Played Heroes
             * @type {Collection<string, Hero>}
             * @private
             */
            this._playedHeroes = new Collection();
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
     * Returns a Player's team number
     * @returns {number} player's jersey number
     */
    get playerNumber() {
        return this._playerNumber;
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

    /**
     * Returns a Player's heroes
     * @returns {String[]} player's heroes
     */
    get heroes() {
        return this._heroes;
    }

    /**
     * Returns a Player's accounts
     * @returns {Account[]} player's accounts
     */
    get accounts() {
        return this._accounts;
    }

    /**
     * Returns average eliminations per 10 minute
     * @returns {number} average eliminations
     */
    get eliminations() {
        return this._eliminations;
    }

    /**
     * Sets average eliminations per 10 minute
     * @param {number} eliminations elims per 10 minutes 
     */
    setEliminations(eliminations) {
        this._eliminations = eliminations;
    }
    /**
     * Returns average deaths per 10 minute
     * @returns {number} average deaths
     */
    get deaths() {
        return this._deaths;
    }

    /**
     * Sets average deaths per 10 minute
     * @param {number} deaths deaths per 10 minutes 
     */
    setDeaths(deaths) {
        this._deaths = deaths;
    }

    /**
     * Returns average damage per 10 minute
     * @returns {number} average damage
     */
    get heroDamage() {
        return this._heroDamage;
    }

    /**
     * Sets average hero damage per 10 minute
     * @param {number} damage hero damage per 10 minutes 
     */
    setHeroDamage(damage) {
        this._heroDamage = damage;
    }
    /**
     * Returns average healing per 10 minute
     * @returns {number} average healing
     */
    get healing() {
        return this._healing;
    }

    /**
     * Sets average healing per 10 minute
     * @param {number} healing healing per 10 minutes 
     */
    setHealing(healing) {
        this._healing = healing;
    }
    /**
     * Returns average ultimates per 10 minute
     * @returns {number} average ultimates
     */
    get ultimates() {
        return this._ultimates;
    }

    /**
     * Sets average ultimates per 10 minute
     * @param {number} ultimates ultimates per 10 minutes 
     */
    setUltimates(ultimates) {
        this._ultimates = ultimates;
    }
    /**
     * Returns average final blows per 10 minute
     * @returns {number} average final blows
     */
    get finalBlows() {
        return this._finalBlows;
    }

    /**
     * Sets average final blows per 10 minute
     * @param {number} finalBlows final blows per 10 minutes 
     */
    setFinalBlows(finalBlows) {
        this._finalBlows = finalBlows;
    }

    /**
     * Returns time played
     * @returns {number} time played
     */
    get timePlayed() {
        return this._timePlayed;
    }

    /**
     * Returns all played heroes
     * @returns {Hero[]} played heroes
     */
    get playedHeroes() {
        return this._playedHeroes;
    }

    /**
     * Sets time played
     * @param {number} timePlayed total time played
     */
    setTimePlayed(timePlayed) {
        this._timePlayed = timePlayed;
    }
}
module.exports = Player;