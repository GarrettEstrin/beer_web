var
  beerRouter = require('express').Router(),
  Beer = require('../models/Beer.js')

beerRouter.route('/beers')
  .get(function(req, res) {
    User.find({}).exec(function(err, beers) {
      if(err) return console.log(err)
      res.json(beers)
    })
  })

beerRouter.route('/beers/:id')
  .get(function(req, res) {
    User.findById(req.params.id).exec(function(err, beer) {
      if(err) return console.log(err)
      res.json(beer)
    })
  })

module.exports = beerRouter
