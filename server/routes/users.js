var
  userRouter = require('express').Router(),
  User = require('../models/User.js'),
  Kitty = require('../models/Kitty.js')

userRouter.route('/users')
  .get(function(req, res) {
    User.find({}).populate('kitties').exec(function(err, users) {
      if(err) return console.log(err)
      res.json(users)
    })
  })

userRouter.route('/users/:id')
  .get(function(req, res) {
    User.findById(req.params.id).populate('kitties').exec(function(err, user) {
      if(err) return console.log(err)
      res.json(user)
    })
  })

module.exports = userRouter
