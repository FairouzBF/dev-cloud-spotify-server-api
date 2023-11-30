const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  albums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album', title: String }],
  songs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song', title: String, audio: String }],
});

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;
