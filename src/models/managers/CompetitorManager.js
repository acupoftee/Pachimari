'use strict'

const { JsonUtil, Logger } = require('../../utils')
const { Collection } = require('discord.js')
const { getPrimaryColor, getSecondaryColor, getTertiaryColor } = require('owl-colors')
const Competitor = require('../owl_models/Competitor')
const Account = require('../owl_models/Account')
const teamNames = require('../../data/teamnames.json')
const divisions = require('../../data/divisions.json')
const accountTypes = require('../../data/accounts.json')
const Endpoints = require('../owl_models/Endpoints')

/**
 * A collection of Competitors
 * @type {Collection<number, Competitor}
 */
const competitors = new Collection()

/**
 * @description Loads and manages Competitors
 */
class CompetitorManager {
  /**
   * @description Initalizes a CompetitorManager
   * @constructor
   */
  constructor () {
    /**
     * Array of Competitor Ids
     * @type {Array}
     * @private
     */
    this._competitors = []
  }

  /**
   * Returns Overwatch League Competitors
   * @returns {Collection<string, Object>} competitors
   */
  static get competitors () {
    return competitors
  }

  /**
   * Obtains all 2019 Overwatch League Competitors
   * @async
   */
  async getTeams () {
    const body = await JsonUtil.parse(Endpoints.get('COMPETITORS'))
    body.data.forEach(competitor => {
      this._competitors.push(competitor.id)
    })

    return this
  }

  /**
   * Loads all Competitors and stores them in a Collection
   * @async
   */
  async loadCompetitors () {
    for (let i = 0; i < this._competitors.length; i++) {
      const id = this._competitors[i]
      const body = await JsonUtil.parse(Endpoints.get('COMPETITOR', id))
      const data = body.data
      const dark = data.abbreviatedName === 'LDN' ? data.logo.main.png : data.logo.altDark.png

      const competitor = new Competitor(
        data.id,
        data.divisionId,
        data.name,
        data.abbreviatedName,
        data.logo.main.png,
        data.logo.mainName.svg,
        dark,
        data.location,
        getPrimaryColor(data.abbreviatedName).hex,
        getSecondaryColor(data.abbreviatedName).hex,
        getTertiaryColor(data.abbreviatedName).hex,
        data.website,
        data.placement,
        data.records.matchWin,
        data.records.matchLoss,
        data.records.matchDraw
      )

      data.accounts.forEach(acc => {
        let type = acc.type
        for (let i = 0; i < accountTypes.length; i++) {
          const a = accountTypes[i]
          if (a.type === acc.type) { type = a.title }
        }
        const account = new Account(acc.id, type, acc.url)
        competitor.accounts.set(acc.id, account)
      })

      competitors.set(data.id, competitor)
      Logger.custom('TEAM', `Loaded ${data.id} ${data.name}`)
    }
  }

  /**
     * Finds a Competitor ID by name
     * @param {string} val the competitor's name
     * @returns the Competitor's ID
     */
  static locateTeam (val) {
    const key = val.toLowerCase()
    for (let i = 0; i < teamNames.length; i++) {
      const competitor = teamNames[i]
      const id = competitor.id

      // return id if keys are equal
      if (key === id) {
        return id
      }

      // return id if names are equal
      for (let j = 0; j < competitor.values.length; j++) {
        const value = competitor.values[j]
        if (key === value) {
          return id
        }
      }
    }
  }

  /**
   * Returns all updated competitor stats.
   * 0: placement, 1: win, 2: loss, 3: draws,
   * @param {Competitor} competitor
   * @returns {Promise<number[]>} an array of stats
   */
  static async updateTeamStats (competitor) {
    const stats = []
    const body = await JsonUtil.parse(Endpoints.get('COMPETITOR', competitor.id))
    stats.push(body.data.placement)
    stats.push(body.data.records.matchWin)
    stats.push(body.data.records.matchLoss)
    stats.push(body.data.records.matchDraw)
    return stats
  }

  /**
   * Updates the competitor's placement
   * @param {Competitor} competitor
   * @returns {number} the competitor's current placement
   */
  static async updateRanking (competitor) {
    const body = await JsonUtil.parse(Endpoints.get('COMPETITOR', competitor.id))
    const data = body.data
    const ranking = data.placement
    Logger.info(`Updated placement for ${competitor.name} to ${ranking}`)
    return ranking
  }

  /**
   * Updates the competitor's win
   * @param {Competitor} competitor
   * @returns {number} the competitor's current wins
   */
  static async updateWin (competitor) {
    const body = await JsonUtil.parse(Endpoints.get('COMPETITOR', competitor.id))
    const data = body.data
    const win = data.records.matchWin
    Logger.info(`Updated wins for ${competitor.name} to ${win}`)
    return win
  }

  /**
   * Updates the competitor's losses
   * @param {Competitor} competitor
   * @returns {number} the competitor's current losses
   */
  static async updateLoss (competitor) {
    const body = await JsonUtil.parse(Endpoints.get('COMPETITOR', competitor.id))
    const data = body.data
    const loss = data.records.matchLoss
    Logger.info(`Updated losses for ${competitor.name} to ${loss}`)
    return loss
  }

  /**
   * Updates the competitor's ties
   * @param {Competitor} competitor
   * @returns {number} the competitor's current draws
   */
  static async updateDraws (competitor) {
    const body = await JsonUtil.parse(Endpoints.get('COMPETITOR', competitor.id))
    const data = body.data
    const draws = data.records.matchDraw
    Logger.info(`Updated draws for ${competitor.name} to ${draws}`)
    return draws
  }

  /**
   * Finds a Competitor account by name
   * @param {string} val the competitor's account type
   * @returns {string} the Competitor's account url
   */
  static locateAccount (competitor, val) {
    const key = val.toLowerCase()
    competitor.accounts.forEach(acc => {
      const type = acc.type.toLowerCase()
      if (key === type) {
        return acc.url
      }
    }) // O(c*a) time. try to optimize
  }

  /**
   * Convert a division from ID to name or vice-versa.
   * @static
   * @param {String|number} division Name or ID of the divison.
   * @returns {String|number}
   */
  static getDivision (division, abbreviated = false) {
    for (let i = 0; i < divisions.length; i++) {
      const div = divisions[i]
      if (typeof division === 'string') {
        if (div.values.includes(division)) {
          return div.id
        }
      } else if (typeof division === 'number') {
        const long = div.values[0]
        if (division === div.id) {
          if (abbreviated) {
            return div.abbrev
          }
          return long.charAt(0).toUpperCase() + long.slice(1)
        }
      }
    }
  }
}
module.exports = CompetitorManager
