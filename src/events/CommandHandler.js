'use strict'
require('dotenv').config()

const { Event } = require('../models')
const { Logger } = require('../utils')
// const Queries = require('../db/Queries');
// const mongoose = require('mongoose')
const Server = require('../dbv2/serverdb')

/**
 * Responsible for handling various Pachimari Commands
 * @extends {Event}
 */
class CommandHandler extends Event {
  /**
     * Executes a command based on the command parsed in the
     * Message content.
     * @param {Client} client a Discord bot Client
     */
  async execute (client) {
    client.on('message', async message => {
      const serverGuild = client.guilds.get(message.guild.id)
      Server.findOne({
        guildID: serverGuild.id
      }, (err, guild) => {
        if (err) console.error(err)
        if (!guild) {
          const newServer = new Server({
            guildID: serverGuild.id.toString()
          })
          guild = newServer
          newServer.save()
        }
        client.prefix = guild.prefix
        if (!message.content.startsWith(client.prefix) || message.author.bot) {
          return
        }
        if (message.channel.type !== 'text') {
          return
        }

<<<<<<< HEAD
      // const row = await Queries.getGuild(message.guild.id);
      client.prefix = process.env.COMMAND_PREFIX
      if (!message.content.startsWith(client.prefix) || message.author.bot) {
        return
      }
      if (message.channel.type !== 'text') {
        return
      }
=======
        // https://anidiots.guide/first-bot/command-with-arguments
        const args = message.content.slice(client.prefix.length).trim().split(/ +/g)
        const commandName = args.shift().toLowerCase()
        const command = client.commands.get(commandName)
>>>>>>> development

        if (!command) {
          return
        }
        try {
          client.commands.get(command.name).execute(client, message, args)
        } catch (error) {
          Logger.error(error)
        }
      })
    })
  }
}
module.exports = CommandHandler
