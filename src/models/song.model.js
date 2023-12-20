const mongoose = require('mongoose');
const Genre = require('./genre.model');
const Artist = require('./artist.model');
const Album = require('./album.model');

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true, name: String },
  artistName: { type: String },
  // genre: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre', required: true },
  album: { type: mongoose.Schema.Types.ObjectId, ref: 'Album', required: true, title: String },
  albumTitle: { type: String },
  albumCover: { type: String },
  audio: { type: String, required:  true },
  duration: { type: Number, required: true },
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;
