const mongoose = require('mongoose');
const Song = require('./song.model');

const albumSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true, name: String },
  releaseDate: { type: Date },
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song', title: String, audio: String, genre: String}], 
});

const Album = mongoose.model('Album', albumSchema);

module.exports = Album;
