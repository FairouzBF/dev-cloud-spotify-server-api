const mongoose = require('mongoose');

const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  // Ajoutez d'autres champs si nécessaire
});

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;
