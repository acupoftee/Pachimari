'use strict'

const { JsonUtil, Logger } = require('../../../utils')

const { Collection } = require('discord.js')
const Competitor = require('../Competitor')
const Player = require('../Player')
const contendersTeamNames = require('../../../data/contendersteams.json')
const accountTypes = require('../../../data/accounts.json')
// const Account = require('../../owl_models/Account')
// const teamNames = require('../../data/teamnames.json')
// const divisions = require('../../data/divisions.json')
// const accountTypes = require('../../data/accounts.json')
// const Endpoints = require('../../owl_models/Endpoints')

/**
 * A collection of Competitors in Contenders
 * @type {Collection<number, Competitor}
 */
const competitorsContenders = new Collection()

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
     * Array of Contenders Competitor Ids
     * @type {Array}
     * @private
     */
    this._competitors = []
  }

  /**
   * Returns Overwatch Contenders Competitors
   * @returns {Collection<string, Object>} competitors
   */
  static get contendersCompetitors () {
    return competitorsContenders
  }

  /**
   * Obtains all 2019 Overwatch League Contenders Competitors
   * @async
   */
  async getTeams () {
    const body = await JsonUtil.parse('https://api.overwatchcontenders.com/teams')
    body.competitors.forEach(competitor => {
      this._competitors.push(competitor.competitor.id)
    })
    return this
  }

  /**
   * Loads all Competitors and stores them in a Collection
   * @async
   */
  async loadCompetitors () {
    const body = await JsonUtil.parse('https://api.overwatchcontenders.com/teams')
    const teams = body.competitors
    for (const team of teams) {
      const data = team.competitor
      if (data.name.toLowerCase().includes('bye')) {
        continue
      }

      let abbreviatedName = data.name === 'Meta Athena' ? 'ATHE' : data.abbreviatedName
      abbreviatedName = data.name === 'ATL Academy' ? 'ATLA' : data.abbreviatedName

      const competitor = new Competitor(
        data.id,
        data.name,
        abbreviatedName,
        data.logo,
        data.primaryColor || 'afe915',
        data.secondaryColor || '000000',
        data.region
      )

      // console.log(competitor)
      data.players.forEach(({ player }) => {
        const newPlayer = new Player(player.id, data.id, 0,
          player.name, player.givenName, player.familyName, player.nationality)
        competitor.players.set(player.id, newPlayer)
      })

      const teamFullInfo = await JsonUtil.parse(`https://api.overwatchcontenders.com/teams/${data.id}`)
      if (teamFullInfo.id) {
        const fullRoster = teamFullInfo.players
        for (const player of fullRoster) {
          const teamMember = competitor.players.get(player.id)
          teamMember.role = player.attributes.role
          teamMember.heroes = player.attributes.heroes
          teamMember.accounts = player.accounts
          // console.log('team member', teamMember)
        }
      }

      competitorsContenders.set(data.id, competitor)
      Logger.custom('CONTENDERS TEAM', `Loaded ${data.id} ${data.name}`)
    }
  }

  /**
     * Finds a Competitor ID by name
     * @param {string} val the competitor's name
     * @returns the Competitor's ID
     */
  static locateTeam (val) {
    const key = val.toLowerCase()
    for (let i = 0; i < contendersTeamNames.length; i++) {
      const competitor = contendersTeamNames[i]
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
}
module.exports = CompetitorManager
