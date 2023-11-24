const mongoose = require('mongoose');
const Genre = require('./genre.model');
const Artist = require('./artist.model');

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
  genre: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre', required: true },
  audio: { type: String, required:  true },
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;