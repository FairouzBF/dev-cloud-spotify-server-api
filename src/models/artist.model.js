const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  albums: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Album', title: String, releaseDate: Date }],
  // Ajoutez d'autres champs si nécessaire
});

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;
