const express = require('express');
const bodyParser = require('body-parser');

const {ShowDate} = require('./model');
const router = express.Router();
const jsonParser = bodyParser.json();


// CREATE
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['userId', 'date', 'time', 'locationId', 'status'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  let {userId, date, time, locationId, status} = req.body;
  userId = userId.trim();
  date = date.trim();
  time = time.trim();
  locationId = locationId.trim();
  status = status.trim();

  return ShowDate.findOne({userId: userId, date: date, time: time, locationId: locationId})
    .count()
    .then(count => {
      if (count > 0) {
        // There is an existing song list with the same title
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'The show you entered already exists.',
          location: 'show date'
        });
      }

      return ShowDate.create({
        userId,
        date,
        time,
        locationId,
        status
      });
    })
    .then( show => {
      return res.status(201).json(show.apiRepr());
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
  return ShowDate.find()
    .then( dates => res.json( dates.map( date => date.apiRepr()) ))
    .catch( err => {console.log(err);
      res.status(500).json({message: 'Internal server error'})
     });
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
  const updateableFields = ['date', 'time', 'locationId', 'status'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  ShowDate
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .then(date => res.status(204).end())
    .catch(err => res.status(500).json({message: 'Internal server error'}));

});

// DELETE
router.delete('/:id', (req, res) => {
  ShowDate
    .findByIdAndRemove(req.params.id)
    .then( date => res.status(204).end() )
    .catch( err => res.status(500).json({message: 'Internal server error'}) );
});


module.exports = {router};
