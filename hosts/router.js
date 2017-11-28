const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const {User} = require('../users/model');
const router = express.Router();
const jsonParser = bodyParser.json();


// host home
router.get('/:userName', (req, res) => {
  res.render('pages/hosts');
});

module.exports = {router};
