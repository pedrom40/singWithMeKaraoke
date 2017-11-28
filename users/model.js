const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema ({
  type: {
    type: String, default: 'Singer',
    required: true
  },
  firstName: {type: String},
  lastName: {type: String},
  userName: {
    type: String,
    unique: true,
    minlength: 5
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 72
  },
  location: {
    city: String,
    state: String
  },
  phone: {type: String}
});

// handles all things password related
UserSchema.plugin(require('mongoose-bcrypt'));
UserSchema.plugin(require('mongoose-unique-validator'));

// for sending user objects without sensitive data
UserSchema.methods.apiRepr = function() {
  return {
    type: this.type || '',
    userName: this.userName || '',
    firstName: this.firstName || '',
    lastName: this.lastName || ''
  };
};

const User = mongoose.model('User', UserSchema);

module.exports = {User};
