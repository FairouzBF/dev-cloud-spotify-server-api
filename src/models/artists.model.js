const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  // Ajoutez d'autres champs si nécessaire
});

const Artist = mongoose.model('Artist', artistSchema);

module.exports = Artist;
