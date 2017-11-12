const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');

const {User} = require('../users/model');
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
  return User.insertMany(seedData);

}

// generate test data
function generateData () {
  return {
    type: "Singer",
    userName: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password()
  }
}

// delete test data
function tearDownDb () {
  console.warn('deleting test db');
  return mongoose.connection.dropDatabase();
}

describe('Users API resource', () => {

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

    it('should return all users', () => {

      // make response variable available throughout nests
      let res;

      return chai.request(app)

        // get all the existing records
        .get('/api/users')

        // now check them out
        .then( _res => {

          // pass to parent res var; success status and count check
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body).to.have.length.of.at.least(1);

          // send number of records to next promise
          return User.count();

        })

        // now make sure we have the correct number
        .then( count => {
          expect(res.body).to.have.lengthOf(count);
        });

    });

  });

  // test POST endpoint
  describe('POST endpoint', () => {

    it('should add a new user', () => {

      // init new record
      const newRecord = generateData();

      return chai.request(app)
        .post('/api/users')
        .send(newRecord)
        .then( res => {

          // ensure response has all necessary info
          expect(res).to.have.status(201);

          // expected return from apiRepr method in model
          expect(res.body).to.have.deep.keys({type: 1, userName: 1, firstName: 1, lastName: 1});

          // check that the info matches what was passed in
          expect(res.body.userName).to.equal(`${newRecord.userName}`);

          // pass new record to next part in the chain (promise)
          return User.find({userName: res.body.userName});

        })
        .then( user => {

          // check that the title in the post matches the title in the db
          expect(user[0].userName).to.equal(newRecord.userName);

        });

    });

  });

  // test PUT endpoint
  describe('PUT endpoint', () => {

    it('should update the fields you send over', () => {

      // data to update
      const updateData = {
        firstName: 'Pedro',
        lastName: 'Morin',
        phone: '361.903.0942'
      }

      return User
        .findOne()
        .then( user => {

          // set the id property of the update data to the record we returned
          updateData.id = user.id;

          // make the update, then return the record to the next promise
          return chai.request(app)
            .put(`/api/users/${user.id}`)
            .send(updateData);

        })
        .then( res => {

          // check status
          expect(res.status).to.equal(204);

          // get the record
          return User.findById(updateData.id);

        })
        .then( user => {

          // check that the title and content equal the updated values
          expect(user.firstName).to.equal(updateData.firstName);
          expect(user.lastName).to.equal(updateData.lastName);
          expect(user.phone).to.equal(updateData.phone);

        });

    });

  });

  // test DELETE endpoint
  describe('DELETE endpoint', () => {

    it('should delete a record by id', () => {

      // declare record var here so we can access it across the test
      let user;

      return User
        .findOne()
        .then ( _user => {

          // set the returned record as our test var, then send for deletion
          user = _user;
          return chai.request(app).delete(`/api/users/${user.id}`);

        })
        .then( res => {

          // check for correct stats
          expect(res.status).to.equal(204);

          // attempt to retrieve the record
          return User.findById(user.id);

        })
        .then( _user => {

          // should not find record
          expect(_user).to.not.exist;

        });
    });

  });

});
