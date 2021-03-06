var
  beerRouter = require('express').Router(),
  Beer = require('../models/Beer.js'),
  dotenv = require('dotenv'),
  https = require('https')

beerRouter.route('/')
  .get(function(req, res) {
    Beer.find({}).populate('user').exec(function(err, beers) {
      if(err) return console.log(err)
      res.json(beers)
    })
  })

  .post(function(req, res){
    console.log("INCOMING BEER! GET LIT!");
    console.log(req.body);
    Beer.create({
      name: req.body.name,
      color: req.body.color,
      alcoholcontent: req.body.alcoholcontent,
      bitter: req.body.bitter,
      picture: req.body.picture,
      location: req.body.location,
      review: {
        title: req.body.review.title,
        body: req.body.review.body
      },
      user: req.body.user

    }, function(err, beer){
      if (err) return console.log(err)
      // return beer
      User.findById(req.user._id, function(err, user){
        user.beers.push(beer)
        user.save(function(err, data){
          console.log(beer);
          // res.json(data)
          res.json({success: true, message: "beer created 🍺", beer: beer})
        })
      })
    })
  })


beerRouter.route('/:id')
  .get(function(req, res) {
    Beer.findById(req.params.id).populate('user').exec(function(err, beer) {
      if(err) return console.log(err)
      res.json(beer)
    })
  })

  .delete(function(req, res){
    Beer.remove({_id: req.params.id}, function(err, beer){
      if(err) return console.log(err)
      res.json(beer)
    })
  })

  .patch(function(req, res){
    console.log("Req:");
    console.log(req.body);
    Beer.update({_id: req.params.id}, {$set: {review: {title: req.body.title, body: req.body.body}}}, function(err, beer){
      if(err) return console.log(err)
      res.json({success: true, message: "beer review created 🍺", beer: beer, beerid: req.body.beerId})
    })
  })





module.exports = beerRouter
