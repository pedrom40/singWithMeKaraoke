const express = require('express');
const bodyParser = require('body-parser');

const {SongList} = require('./model');
const router = express.Router();
const jsonParser = bodyParser.json();


// CREATE
router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['userId', 'title'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'ValidationError',
      message: 'Missing field',
      location: missingField
    });
  }

  let {userId, title, songs} = req.body;
  userId = userId.trim();
  title = title.trim();

  return SongList.find({userId: userId, title: title})
    .count()
    .then(count => {
      if (count > 0) {
        // There is an existing song list with the same title
        return Promise.reject({
          code: 422,
          reason: 'ValidationError',
          message: 'Title already taken',
          location: 'title'
        });
      }

      return SongList.create({
        userId,
        title,
        songs
      });
    })
    .then( list => {
      return res.status(201).json(list.apiRepr());
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
  return SongList.find()
    .then( lists => res.json( lists.map( list => list.apiRepr()) ))
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
  const updateableFields = ['title', 'songs'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  SongList
    .findByIdAndUpdate(req.params.id, {$set: toUpdate})
    .then(list => {
      res.status(204).end()
    })
    .catch(err => {
      res.status(500).json({message: 'Internal server error'})
    });

});

// DELETE
router.delete('/:id', (req, res) => {
  SongList
    .findByIdAndRemove(req.params.id)
    .then( list => res.status(204).end() )
    .catch( err => res.status(500).json({message: 'Internal server error'}) );
});


module.exports = {router};
