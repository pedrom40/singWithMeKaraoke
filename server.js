// include libraries
require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const ejs = require('ejs');

// setup routers
const {router: usersRouter} = require('./users/router');
const {router: authRouter, basicStrategy, jwtStrategy} = require('./auth');
const {router: songListRouter} = require('./song_lists/router');
const {router: hostsRouter} = require('./hosts/router');
const {router: singersRouter} = require('./singers/router');

// app setup
mongoose.Promise = global.Promise;
const {PORT, DATABASE_URL} = require('./config');
const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// Logging
app.use(morgan('common'));
app.use(bodyParser.json());

// CORS
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

app.use(passport.initialize());
passport.use(basicStrategy);
passport.use(jwtStrategy);

// setup middleware
app.use(express.static('public'));

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);
app.use('/api/songLists/', songListRouter);

app.use('/singers/', singersRouter);
app.use('/hosts/', hostsRouter);


// root domain
app.get('/', (req, res) => {
  res.render('pages/index');
});

// user login path
app.get('/login', (req, res) => {
  res.render('pages/login');
});

// catch all method
app.use('*', (req, res) => {
  return res.status(404).json({message: 'Path Not Found'});
});


// setup server
let server;

function runServer(databaseUrl=DATABASE_URL, port=PORT) {
  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app
      .listen(PORT, () => {
        console.log(`Your app is listening on port ${PORT}`);
        resolve();
      })
      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
}

module.exports = {app, runServer, closeServer};
