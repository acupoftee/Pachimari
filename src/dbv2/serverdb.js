const mongoose = require('mongoose')
const Schema = mongoose.Schema

const config = new Schema({
  guild: {
    type: String,
    required: true
  }
})
