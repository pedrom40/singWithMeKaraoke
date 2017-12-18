const mongoose = require('mongoose');

const ShowDateSchema = mongoose.Schema ({
  userId: {type: String, required: true},
  date: {type: Date, required: true},
  time: {type: String, required: true},
  location: {type: mongoose.Schema.Types.ObjectId, ref: 'ShowLocation'},
  status: {type: String, required: true}
});

// for sending user objects without sensitive data
ShowDateSchema.methods.apiRepr = function() {console.log(this);
  ShowDate
    .findById(this.id)
    .populate('name')
    .then( showDate => {console.log(showDate);
      return {
        date: showDate.date,
        time: showDate.time,
        location: showDate.location.name,
        status: showDate.status
      };
    });
};

const ShowDate = mongoose.model('ShowDate', ShowDateSchema);

module.exports = {ShowDate};
