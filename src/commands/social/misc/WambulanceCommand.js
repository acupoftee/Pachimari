'use strict'

const { Command } = require('../../../models')
const { WambulanceGif } = require('../../../models/owl_models')
const { Emojis } = require('../../../constants')
const fs = require('fs')

// const { Tweets } = require('../../../social')
// const { Emoji } = require('discord.js');
// const open = require('open');

class WambulanceCommand extends Command {
  constructor () {
    super()
    this.name = 'whambulance'
    this.description = 'Call a whambulance!'
    this.usage = 'whamnulance'
    this.aliases = []
  }

  async execute (client, message, args) {
    const loading = message.channel.send(Emojis.LOADING)
    const waa = new WambulanceGif()
    // let tweet = new Tweets();
    await waa.buildWambulanceGif()
    loading.then(msg => {
      fs.readdir('src/res/', function (files) {
        const gif = 'src/res/waa.gif'
        msg.edit('👀').then(m => {
          message.channel.send({
            files: [gif]
          })
        })
      })
    })
  }
}
module.exports = WambulanceCommand
