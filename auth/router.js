const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {User} = require('../users/model');
const config = require('../config');

const createAuthToken = user => {
  return jwt.sign({user}, config.JWT_SECRET, {
    subject: user.userName,
    expiresIn: config.JWT_EXPIRY,
    algorithm: 'HS256'
  });
};

const router = express.Router();

// The user provides a username and password to login
router.post('/login', (req, res) => {

  let user;
  User
    .findOne({userName: req.body.userName})
    .then(_user => {
      user = _user;
      if (!user) {
        return res.status(401).send({
          reason: 'LoginError',
          message: 'Incorrect username or password.'
        });
      }
      return user.verifyPassword(req.body.password);
    })
    .then( () => {
      const authToken = createAuthToken(user.apiRepr());
      res.json({token: authToken});
    })
    .catch(error => {console.log(error);
      return res.status(401).send({
        reason: 'LoginError',
        message: 'Incorrect username or password'
      });
    });

});

// The user exchanges an existing valid JWT for a new one with a later expiration
router.post('/refresh', passport.authenticate('jwt', {session: false}), (req, res) => {
  const authToken = createAuthToken(req.user);
  res.json({authToken});
});


module.exports = {router};
