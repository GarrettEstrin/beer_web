var
  userRouter = require('express').Router(),
  User = require('../models/User.js')

userRouter.route('/')
  .get(function(req, res) {
    User.find({}).populate('Beer').exec(function(err, users) {
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

  .delete(function(req, res){
    User.remove({_id: req.params.id}, function(err, user){
      if(err) return console.log(err)
      res.json(user)
    })
  })

  .patch(function(req, res){
    User.update({_id: req.params.id}, {$set: req.body}, function(err, user){
      if(err) return console.log(err)
      res.json(user)
    })
  })

module.exports = userRouter
