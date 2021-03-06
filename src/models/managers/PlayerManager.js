'use strict'

const { JsonUtil, Logger } = require('../../utils')
const { Collection } = require('discord.js')
const CompetitorManager = require('./CompetitorManager')
const Player = require('../owl_models/Player')
const Account = require('../owl_models/Account')
const accountTypes = require('../../data/accounts.json')
const Endpoints = require('../owl_models/Endpoints')
const heroData = require('../../data/heroes.json')
const Hero = require('../owl_models/Hero')

/**
 * A collection of Players
 * @type {Collection<number, Player>}
 */
const players = new Collection()

class PlayerManager {
  constructor () {
    /**
         * Array of Player IDs
         * @type {Array}
         * @private
         */
    this._players = []
  }

  /**
     * Returns Overwatch League Team Players
     * @returns {Collection<string, Object>} players
     */
  static get players () {
    return players
  }

  /**
     * Obtains all 2019 Overwatch League Players
     * @async
     */
  async getPlayers () {
    const playerBody = await JsonUtil.parse(Endpoints.get('PLAYERS'))
    playerBody.content.forEach(player => {
      this._players.push(player.id)
    })

    return this
  }

  /**
     * Loads all Players and stores them in a Collection
     * @async
     */
  async loadPlayers () {
    for (let i = 0; i < this._players.length; i++) {
      const id = this._players[i]
      const body = await JsonUtil.parse(Endpoints.get('PLAYER', id))
      const statsbody = await JsonUtil.parse(Endpoints.get('HERO-STATS', id))
      const data = body.data.player
      const heroArray = []

      // console.log(data.attributes.heroes)
      if (data.attributes.heroes !== undefined && data.attributes.heroes !== null) {
        heroData.forEach(hero => {
          if (data.attributes.heroes.includes(hero.key)) {
            heroArray.push(hero.title)
          }
        })
      }

      const player = new Player(
        data.id,
        data.teams[0].team.id,
        data.attributes.player_number,
        data.name,
        data.homeLocation === undefined ? '' : data.homeLocation,
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
        // playedHeroes
      )
      data.accounts.forEach(acc => {
        let type = acc.accountType
        for (let i = 0; i < accountTypes.length; i++) {
          const a = accountTypes[i]
          if (a.type === acc.accountType) {
            type = a.title
          }
        }
        const account = new Account(acc.id, type, acc.value)
        player.accounts.set(acc.id, account)
      })

      const playerHeroes = statsbody.data.stats.heroes
      playerHeroes.forEach(hero => {
        // console.log(hero);
        const playedHero = new Hero(
          hero.hero_id,
          hero.name,
          hero.stats.eliminations_avg_per_10m,
          hero.stats.deaths_avg_per_10m,
          hero.stats.hero_damage_avg_per_10m,
          hero.stats.healing_avg_per_10m,
          hero.stats.ultimates_earned_avg_per_10m,
          hero.stats.final_blows_avg_per_10m,
          hero.stats.time_played_total)
        player.playedHeroes.set(hero.name, playedHero)
      })

      // console.log(player.playedHeroes)
      const competitor = CompetitorManager.competitors.get(data.teams[0].team.id)
      competitor.players.set(data.id, player)
      players.set(data.id, player)
      Logger.custom('PLAYER', `Loaded player ${data.id} ${data.name}`)
    }
  }

  /**
     * Finds a Player ID by name
     * @param {string} val the player's name
     * @returns {number} the Player's ID
     */
  static locatePlayer (val) {
    const key = val.toLowerCase()
    let id = 0
    players.forEach(player => {
      if (player.name.toLowerCase() === key) {
        id = player.id
      }
    })
    return id
  }

  static async getHeroes (player) {
    const body = await JsonUtil.parse(Endpoints.get('HERO-STATS', player.id))
    const heroes = body.data.stats.heroes
    return heroes
  }

  /**
     * Updates a player's heroes
     * @param {Player} player
     */
  static async updatePlayedHeroes (player) {
    const statsbody = await JsonUtil.parse(Endpoints.get('HERO-STATS', player.id))
    const playerHeroes = statsbody.data.stats.heroes
    playerHeroes.forEach(hero => {
      // console.log(hero);
      const playedHero = new Hero(
        hero.hero_id,
        hero.name,
        hero.stats.eliminations_avg_per_10m,
        hero.stats.deaths_avg_per_10m,
        hero.stats.hero_damage_avg_per_10m,
        hero.stats.healing_avg_per_10m,
        hero.stats.ultimates_earned_avg_per_10m,
        hero.stats.final_blows_avg_per_10m,
        hero.stats.time_played_total)
      player.playedHeroes.set(hero.name, playedHero)
    })
    Logger.info(`Updated played heroes for ${player.name}`)
  }

  /**
     * Returns all updated player stats.
     * 0: eliminations, 1: deaths, 2: hero damage, 3: healing,
     * 4: ultimates, 5: final blows, 6: time played
     * @param {Player} player
     * @returns {Promise<number[]>} an array of stats
     */
  static async updateStats (player) {
    const stats = []
    const body = await JsonUtil.parse(Endpoints.get('PLAYER', player.id))
    await this.updatePlayedHeroes(player)
    stats.push(body.data.stats.all.eliminations_avg_per_10m)
    stats.push(body.data.stats.all.deaths_avg_per_10m)
    stats.push(body.data.stats.all.hero_damage_avg_per_10m)
    stats.push(body.data.stats.all.healing_avg_per_10m)
    stats.push(body.data.stats.all.ultimates_earned_avg_per_10m)
    stats.push(body.data.stats.all.final_blows_avg_per_10m)
    stats.push(body.data.stats.all.time_played_total)

    Logger.info(`Updated stats for ${player.name}`)
    return stats
  }

  /**
     * Updates necessary stats for a player
     * @param {Player} player
     */
  static async updatePlayerStats (player) {
    const body = await JsonUtil.parse(Endpoints.get('PLAYER', player.id))
    const stats = body.data.stats.all
    player.setEliminations(stats.eliminations_avg_per_10m)
    player.setDeaths(stats.deaths_avg_per_10m)
    player.setHeroDamage(stats.hero_damage_avg_per_10m)
    player.setHealing(stats.healing_avg_per_10m)
    player.setUltimates(stats.ultimates_earned_avg_per_10m)
    player.setFinalBlows(stats.final_blows_avg_per_10m)
    player.setTimePlayed(stats.time_played_total)
  }
}
module.exports = PlayerManager
