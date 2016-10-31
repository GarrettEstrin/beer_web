var
  userRouter = require('express').Router(),
  User = require('../models/User.js')

userRouter.route('/')
  .get(function(req, res) {
    User.find({}, function(err, users) {
      if(err) return console.log(err)
      res.json(users)
    })
  })

userRouter.route('/:id')
  .get(function(req, res) {
    User.findById(req.params.id, function(err, user) {
      if(err) return console.log(err)
      res.json(user)
    })
  })

module.exports = userRouter
