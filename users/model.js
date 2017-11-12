const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema ({
  type: {
    type: String,
    default: 'Singer',
    required: true
  },
  firstName: {
    type: String
  },
  lastName: {
    type: String
  },
  userName: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone: {
    type: String
  }
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
    lastName: this.lastName || '',
    email: this.email || ''
  };
};

const User = mongoose.model('User', UserSchema);

module.exports = {User};
