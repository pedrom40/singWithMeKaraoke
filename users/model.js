const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema ({
  type: {type: String, default: 'Singer', required: true},
  firstName: {type: String},
  lastName: {type: String},
  userName: {type: String, unique: true},
  email: {type: String, required: true, unique: true},
  password: {type: String, required: true},
  phone: {type: String}
});

// handles all things password related
UserSchema.plugin(require('mongoose-bcrypt'));
UserSchema.plugin(require('mongoose-unique-validator'));

// used for validating password when logging in
UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
}

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
