const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const {SongList} = require('../song_lists/model');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');

chai.use(chaiHttp);

// seed db with test data
function seedData () {
  console.log('seeding test data');

  // var to hold test data
  const seedData = [];

  // insert 10 records
  for (let i=0; i < 10; i++) {
    seedData.push(generateData());
  }

  // return the test data
  return SongList.insertMany(seedData);

}

// generate test data
function generateData () {
  return {
    userId: faker.random.uuid(),
    title: faker.random.words(),
    songs: [
      {
        songTitle: faker.random.words(),
        songArtist: faker.random.words()
      }
    ]
  }
}

// delete test data
function tearDownDb () {
  console.warn('deleting test db');
  return mongoose.connection.dropDatabase();
}

describe('Song List API resource', () => {

  before( () => {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach( () => {
    return seedData();
  });

  afterEach( () => {
    return tearDownDb();
  });

  after( () => {
    return closeServer();
  });


  // test GET endpoint
  describe('GET endpoint', () => {

    it('should return all records', () => {

      // make response variable available throughout nests
      let res;

      return chai.request(app)

        // get all the existing records
        .get('/api/songLists')

        // now check them out
        .then( _res => {

          // pass to parent res var; success status and count check
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body).to.have.length.of.at.least(1);

          // send number of records to next promise
          return SongList.count();

        })

        // now make sure we have the correct number
        .then( count => {
          expect(res.body).to.have.lengthOf(count);
        });

    });

  });

  // test POST endpoint
  describe('POST endpoint', () => {

    it('should add a new record', () => {

      // init new record
      const newRecord = generateData();

      return chai.request(app)
        .post('/api/songLists')
        .send(newRecord)
        .then( res => {

          // ensure response has all necessary info
          expect(res).to.have.status(201);

          // expected return from apiRepr method in model
          expect(res.body).to.have.deep.keys({title: 1, songs: 1});

          // check that the info matches what was passed in
          expect(res.body.title).to.equal(`${newRecord.title}`);

          // pass new record to next part in the chain (promise)
          return SongList.find({title: res.body.title});

        })
        .then( list => {

          // check that the title in the post matches the title in the db
          expect(list[0].title).to.equal(newRecord.title);

        });

    });

  });

  // test PUT endpoint
  describe('PUT endpoint', () => {

    it('should update the fields you send over', () => {

      // data to update
      const updateData = {
        title: 'Rock Songs',
        songs: [
          {
            songTitle: "Sweet Child O' Mine",
            songArtist: "Guns N' Roses"
          }
        ]
      }

      return SongList
        .findOne()
        .then( list => {

          // set the id property of the update data to the record we returned
          updateData.id = list.id;

          // make the update, then return the record to the next promise
          return chai.request(app)
            .put(`/api/songLists/${list.id}`)
            .send(updateData);

        })
        .then( res => {

          // check status
          expect(res.status).to.equal(204);

          // get the record
          return SongList.findById(updateData.id);

        })
        .then( list => {

          // check that the title and content equal the updated values
          expect(list.title).to.equal(updateData.title);

        });

    });

  });

  // test DELETE endpoint
  describe('DELETE endpoint', () => {

    it('should delete a record by id', () => {

      // declare record var here so we can access it across the test
      let list;

      return SongList
        .findOne()
        .then ( _list => {

          // set the returned record as our test var, then send for deletion
          list = _list;
          return chai.request(app).delete(`/api/songLists/${list.id}`);

        })
        .then( res => {

          // check for correct stats
          expect(res.status).to.equal(204);

          // attempt to retrieve the record
          return SongList.findById(list.id);

        })
        .then( _list => {

          // should not find record
          expect(_list).to.not.exist;

        });
    });

  });

});
