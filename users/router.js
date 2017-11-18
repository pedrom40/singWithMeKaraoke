const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');

const {User} = require('./model');
const router = express.Router();
const jsonParser = bodyParser.json();


// CREATE: register a new user
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['type', 'userName', 'email', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  // make sure the password is trimmed and has at least 8 characters
  const explicityTrimmedFields = ['password'];
  const nonTrimmedField = explicityTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Cannot start or end with whitespace',
      location: nonTrimmedField
    });
  }

  let {type, userName, email, password} = req.body;
  type = type.trim();
  userName = userName.trim();
  email = email.trim();

  return User.find({userName})
    .count()
    .then(count => {
      if (count > 0) {
        // There is an existing user with the same username
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Username already taken',
          location: 'userName'
        });
      }

      return User.create({
        type,
        userName,
        email,
        password
      });
    })
    .then(user => {
      return res.status(201).json(user.apiRepr());
    })
    .catch(err => {console.log(err);

      // Forward validation errors to client, otherwise give a 500 error, something unexpected happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }

      // return json error msg
      res.status(500).json({code: 500, message: 'Internal server error'});

    });

});

// READ: return all users using the apiRepr method
router.get('/', (req, res) => {
  return User.find()
    .then(users => {
      res.json(users.map(user => user.apiRepr()))
    })
    .catch(err => {
      res.status(500).json({message: 'Internal server error'})
    });
});

// check for active session
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {
  res.json(req.user);
});

// UPDATE
router.put('/:id', jsonParser, (req, res) => {

  // ensure that the id in the request path and the one in request body match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    res.status(400).json({message: message});
  }

  // updatable fields
  const toUpdate = {};
  const updateableFields = ['firstName', 'lastName', 'userName', 'email', 'password', 'phone'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  User
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .then(user => {
      res.status(204).end()
    })
    .catch(err => {
      res.status(500).json({message: 'Internal server error'})
    });

});

// DELETE
router.delete('/:id', (req, res) => {
  User
    .findByIdAndRemove(req.params.id)
    .then(restaurant => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));
});


// check for unique userName
router.get('/userName/:userName', (req, res) => {

  // lookup user by userName and return the count
  return User
          .find({userName: req.params.userName})
          .count()
          .then( count => {
            res.json({totalUsers: count});
          });

});

// check for unique userName
router.get('/email/:email', (req, res) => {

  // lookup user by userName and return the count
  return User
          .find({email: req.params.email})
          .count()
          .then( count => {
            res.json({totalUsers: count});
          });

});

module.exports = {router};
