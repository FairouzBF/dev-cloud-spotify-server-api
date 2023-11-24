const Album = require('../models/album.model');
const Artist = require('../models/artist.model');

// CREATE (ajouter un album)
exports.addAlbum = async (req, res) => {
  try {
    const { title, artist, releaseDate } = req.body;

    let existingArtist = await Artist.findOne({ name: artist });

    // Si l'artiste n'existe pas, créez un nouvel artiste
    if (!existingArtist) {
      existingArtist = new Artist({ name: artist });
      await existingArtist.save();
    }

    // Créez un nouvel objet Album avec les données fournies
    const newAlbum = new Album({
      title,
      artist: existingArtist,
      releaseDate,
    });

    // Enregistrez l'album dans la base de données
    const savedAlbum = await newAlbum.save();

    res.status(201).json(savedAlbum);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout d\'un album.' });
  }
};

// READ (obtenir tous les albums)
exports.getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.find().populate('artist').populate('songs');
    res.json(albums);
  } catch (error) {
    console.error('Erreur lors de la récupération des albums :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des albums.' });
  }
};

// READ (obtenir un album par son ID)
exports.getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id).populate('artist').populate('songs');
    res.json(album);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'album :', error);
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'album.' });
  }
};

// UPDATE (modifier un album)
exports.editAlbum = async (req, res) => {
  try {
    const { title, artist, releaseDate, songs } = req.body;

    // Mettez à jour l'album dans la base de données
    const updatedAlbum = await Album.findByIdAndUpdate(
      req.params.id,
      { title, artist, releaseDate, songs },
      { new: true }
    );

    res.json(updatedAlbum);
  } catch (error) {
    console.error('Erreur lors de la mise à jour d\'un album :', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour d\'un album.' });
  }
};

// DELETE (supprimer un album)
exports.deleteAlbum = async (req, res) => {
  try {
    // Supprimez l'album de la base de données
    const deletedAlbum = await Album.findByIdAndDelete(req.params.id);
    res.json(deletedAlbum);
  } catch (error) {
    console.error('Erreur lors de la suppression d\'un album :', error);
    res.status(500).json({ message: 'Erreur lors de la suppression d\'un album.' });
  }
};
