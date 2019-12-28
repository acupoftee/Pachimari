const mongoose = require('mongoose')
const Schema = mongoose.Schema

const config = new Schema({
  prefix: {
    type: String,
    required: true,
    default: '!'
  },
  guildID: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Server', config)
