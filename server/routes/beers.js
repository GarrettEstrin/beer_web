var
  beerRouter = require('express').Router(),
  Beer = require('../models/Beer.js')

beerRouter.route('/')
  .get(function(req, res) {
    Beer.find({}).exec(function(err, beers) {
      if(err) return console.log(err)
      res.json(beers)
    })
  })

  .post(function(req, res){
    Beer.create({name: req.body.name}, function(err, beer){
      res.json(beer)
    })
  })

beerRouter.route('/:id')
  .get(function(req, res) {
    Beer.findById(req.params.id).exec(function(err, beer) {
      if(err) return console.log(err)
      res.json(beer)
    })
  })



module.exports = beerRouter
