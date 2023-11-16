const mongoose = require('mongoose');
const Genre = require('./genres.model');
const Artist = require('./artists.model');

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
  genre: { type: mongoose.Schema.Types.ObjectId, ref: 'Genre', required: true },
  // Ajoutez d'autres champs nécessaires
});

const Song = mongoose.model('Song', songSchema);

module.exports = Song;