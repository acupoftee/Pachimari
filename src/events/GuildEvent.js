'use strict'

const { Event } = require('../models')
const Queries = require('../db/Queries')

class GuildEvent extends Event {
  async execute (client) {
    client.on('guildCreate', async guild => {
      await Queries.addGuild(guild.id)
    })

    client.on('guildDelete', async guild => {
      await Queries.deleteGuild(guild.id)
    })
  }
}
module.exports = GuildEvent
