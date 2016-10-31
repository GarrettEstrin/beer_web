var
  mongoose = require('mongoose'),
  kittySchema = new mongoose.Schema({
    name: String,
    image: String,
    owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
  })

var Kitty = mongoose.model('Kitty', kittySchema)

module.exports = Kitty
