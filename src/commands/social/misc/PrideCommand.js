'use strict'

const { Command } = require('../../../models')
const { PrideGif } = require('../../../models/owl_models')
const { Emojis } = require('../../../constants')
const { Logger, AlertUtil } = require('../../../utils')
const fs = require('fs')

class PrideCommand extends Command {
  constructor () {
    super()
    this.name = 'pride'
    this.description = "Happy Pride Month! (alpha option's from 1-10)"
    this.usage = 'pride [alpha]'
    this.aliases = ['gay']
  }

  async execute (client, message, args) {
    const loading = message.channel.send(Emojis.LOADING)
    const pride = new PrideGif()
    let alpha = 5
    Logger.custom('PRIDE', 'USING PRIDE COMMAND')
    if (args.length === 1) {
      if (isNaN(args[0]) || args[0] < 0 || args[0] > 10) {
        loading.then(message => message.edit(AlertUtil.ERROR('Use a number between 1 and 10 for a pretty gay flag :rainbow::heart:')))
        return
      } else {
        alpha = args[0]
      }
    }
    await pride.buildPrideGif(message.author.avatarURL.replace(/(gif|webp)/g, 'png'), alpha)
    loading.then(msg => {
      fs.readdir('src/res/', function (files) {
        const gif = 'src/res/pride.gif'
        msg.edit(':rainbow: :heart:').then(m => {
          message.channel.send({
            files: [gif]
          })
        })
      })
    })
  }
}
module.exports = PrideCommand
