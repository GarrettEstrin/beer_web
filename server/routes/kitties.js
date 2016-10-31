var
  kittyRouter = require('express').Router(),
  User = require('../models/User.js'),
  Kitty = require('../models/Kitty.js')

kittyRouter.route('/kitties')
  .get(function(req, res) {
    Kitty.find({}).populate('owner').exec(function(err, kitties) {
      if(err) return console.log(err)
      res.json(kitties)
    })
  })
  .post(function(req, res) {
    User.findById(req.user._id).populate('kitties').exec(function(err, user) {
      if(err) return console.log(err)
      var newKitty = new Kitty(req.body)
      newKitty.owner = user
      newKitty.save(function(err, kitty) {
        if(err) return console.log(err)
        user.kitties.push(kitty)
        user.save(function(err, user) {
          if(err) return console.log(err)
          res.json({success: true, message: "Kitty created..", kitty: kitty})
        })
      })
    })
  })

kittyRouter.route('/kitties/:id')
  .delete(function(req, res) {
    User.findById(req.user._id, function(err, user) {
      if(err) return console.log(err)
      user.kitties.pull({_id: req.params.id})
      Kitty.findByIdAndRemove(req.params.id, function(err) {
        if(err) return console.log(err)
        user.save(function(err, user) {
          if(err) return console.log(err)
          res.json({success: true, message: 'Kitty deleted 😑'})
        })
      })
    })
  })
module.exports = kittyRouter
