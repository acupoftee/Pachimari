const mongoose = require('mongoose')
const Schema = mongoose.Schema

const config = new Schema({
  prefix: {
    type: String,
    required: true,
    default: '!'
  }
})

module.exports = mongoose.Model('Server', config)
