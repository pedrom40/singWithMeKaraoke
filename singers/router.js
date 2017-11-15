const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const {User} = require('../users/model');
const router = express.Router();
const jsonParser = bodyParser.json();

// singer home
router.get('/:userName', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.send("Singer's Home Page");
});

module.exports = {router};
