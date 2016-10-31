/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// This setup is ready for user authorization(registration and login with session)
// Uses: express, morgan, cookieParser, bodyParser, bcrypt-nodejs, passport, dotenv



const
  // #!/usr/bin/env node
  PORT = process.env.PORT || 3000

  // dependencies
  express = require('express')
  logger = require('morgan')
  cookieParser = require('cookie-parser')
  bodyParser = require('body-parser')
  expressSession = require('express-session')
  mongoose = require('mongoose')
  hash = require('bcrypt-nodejs')
  path = require('path')
  passport = require('passport')
  passportConfig = require('./config/passport.js'),
  dotenv = require('dotenv').load({silent: true})

// mongoose
var mongoConnectionString = process.env.MONGO_URL

mongoose.connect(mongoConnectionString, function(err) {
  if(err) return console.log(err)
  console.log("Connected to MongoDB")
})

// user schema/model
var User = require('./models/User.js')

// create instance of express
var app = express()

// require routes
var routes = require('./routes/api.js')
var userRoutes = require('./routes/users.js')
var beerRoutes = require('./routes/beers.js')

// define middleware
app.use(express.static(path.join(__dirname, '../client')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(require('express-session')({
    secret: 'passwordis12345',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join(__dirname, 'public')))

// routes
app.use('/users', routes)
app.use('/api', userRoutes)
app.use('/beers', beerRoutes)

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../client', 'index.html'))
})

// error hndlers
app.use(function(req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

app.use(function(err, req, res) {
  res.status(err.status || 500)
  res.end(JSON.stringify({
    message: err.message,
    error: {}
  }))
})

app.listen(PORT, function() {
  console.log("Listening for requests on port:", PORT)
})
