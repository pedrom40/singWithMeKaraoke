const express = require('express');
const bodyParser = require('body-parser');

const {ShowLocation} = require('./model');
const router = express.Router();
const jsonParser = bodyParser.json();


// CREATE
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['name', 'address', 'city', 'state', 'zip'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  let {name, address, city, state, zip} = req.body;
  name = name.trim();
  address = address.trim();
  city = city.trim();
  state = state.trim();
  zip = zip.trim();

  return ShowLocation.findOne({name: name, address: address})
    .count()
    .then(count => {
      if (count > 0) {
        // There is an existing song list with the same title
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'The location you entered already exists.',
          name: 'name'
        });
      }

      return ShowLocation.create({
        name,
        address,
        city,
        state,
        zip
      });
    })
    .then( location => {
      return res.status(201).json(location.apiRepr());
    })
    .catch( err => {console.log(err);

      // Forward validation errors to client, otherwise give a 500 error, something unexpected happened
      if (err.reason === 'ValidationError') {
        return res.status(err.code).json(err);
      }

      // return json error msg
      res.status(500).json({code: 500, message: 'Internal server error'});

    });

});

// READ: return all using the apiRepr method
router.get('/', (req, res) => {
  return ShowLocation.find()
    .then( locations => res.json( locations.map( location => location.apiRepr()) ))
    .catch( err => res.status(500).json({message: 'Internal server error'}) );
});

// UPDATE
router.put('/:id', jsonParser, (req, res) => {

  // ensure that the id in the request path and the one in request body match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (`Request path id (${req.params.id}) and request body id (${req.body.id}) must match`);
    console.error(message);
    res.status(400).json({message: message});
  }

  // updatable fields
  const toUpdate = {};
  const updateableFields = ['name', 'address', 'city', 'state', 'zip'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  ShowLocation
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .then( location => {
      res.status(204).end()
    })
    .catch(err => {
      res.status(500).json({message: 'Internal server error'})
    });

});

// DELETE
router.delete('/:id', (req, res) => {
  ShowLocation
    .findByIdAndRemove(req.params.id)
    .then( location => res.status(204).end() )
    .catch( err => res.status(500).json({message: 'Internal server error'}) );
});


module.exports = {router};
