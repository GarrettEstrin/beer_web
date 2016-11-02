// user model
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var passportLocalMongoose = require('passport-local-mongoose')

var User = new Schema({
  name: String,
  username: {type: String},
  password: String,
  avatar: String,
  beers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Beer'}]
})

User.plugin(passportLocalMongoose)


module.exports = mongoose.model('users', User)
