const mongoose = require('mongoose');

const SongListSchema = mongoose.Schema ({
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  songs: [
    {
      songTitle: String,
      songArtist: String
    }
  ]
});

// for sending user objects without sensitive data
SongListSchema.methods.apiRepr = function() {
  return {
    id: this.id,
    title: this.title,
    songs: this.songs || ''
  };
};

const SongList = mongoose.model('SongList', SongListSchema);

module.exports = {SongList};
