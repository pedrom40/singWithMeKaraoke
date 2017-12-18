const mongoose = require('mongoose');

const ShowLocationSchema = mongoose.Schema ({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zip: {
    type: String,
    required: true
  }
});

// for sending user objects without sensitive data
ShowLocationSchema.methods.apiRepr = function() {
  return {
    name: this.name,
    address: this.address,
    city: this.city,
    state: this.state,
    zip: this.zip
  };
};

const ShowLocation = mongoose.model('ShowLocation', ShowLocationSchema);

module.exports = {ShowLocation};
