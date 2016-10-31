// user model
var mongoose = require('mongoose')
var Schema = mongoose.Schema
var passportLocalMongoose = require('passport-local-mongoose')

var Beer = new Schema({
  name: String,
  color: String,
  alcoholcontent: String,
  bitter: Number,
  picture: String,
  Review: {
    title: String,
    body: String
  },
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    // make this a reference to user model
})

Beer.plugin(passportLocalMongoose)


module.exports = mongoose.model('beers', Beer)
