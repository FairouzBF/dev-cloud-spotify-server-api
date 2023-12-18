const Album = require('../models/album.model');
const Artist = require('../models/artist.model');
const mm = require('music-metadata');

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
    existingArtist.albums.push(savedAlbum._id);
    await existingArtist.save();

    res.status(201).json(savedAlbum);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout d\'un album.' });
  }
};

async function createAlbumFromFile(filePath) {
  try {
    const metadata = await mm.parseFile(filePath);
    console.log('Metadata:', metadata);

    const existingAlbum = await Artist.findOne({ name: metadata.common.album });

    if (existingAlbum) {
        console.error('Album already exists:', existingAlbum);
        return existingAlbum._id;
    }

    const existingArtist = await Artist.findOne({ name: metadata.common.artist });

    const album = new Album({
      title: metadata.common.album,
      artist: existingArtist._id || metadata.common.artist,
      releaseDate: metadata.common.year,
      songs: [],
      albumCover: metadata.common.picture[0].data.toString('base64'),
    });

    await album.save();
    console.log('Album created successfully:', album);
    return album._id;
  } catch (error) {
    console.error(`Error creating album from file ${filePath}:`, error.message);
    throw error;
  }
}

exports.addAlbumFromFile = async (req, res) => {
  try {
    console.log('Request body:', req.body);
    const filePath = req.body.filePath;

    console.log('Creating album from file:', filePath);
    const artistId = await createAlbumFromFile(filePath);

    return res.status(200).json({ message: 'Artist created from file successfully', artistId });
  } catch (error) {
    console.error('Error creating album from file:', error.message);
    return res.status(500).json({ error: 'Internal server error' });
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
    const { title, artist, releaseDate, songs, albumCover } = req.body;

    // Mettez à jour l'album dans la base de données
    const updatedAlbum = await Album.findByIdAndUpdate(
      req.params.id,
      { title, artist, releaseDate, songs, albumCover },
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

exports.getAlbumCover = async (req, res) => {
  try {
    console.log('GET /api/albums/cover called with albumId:', req.params.id);
    const albumId = req.params.id;

    // Find the album by ID
    const album = await Album.findById(albumId);

    if (!album) {
      return res.status(404).json({ error: 'Album not found' });
    }

    // Check if the album has a cover
    if (!album.albumCover) {
      return res.status(404).json({ error: 'Album cover not found' });
    }

    // Send the album cover as a data URI
    res.status(200).send(`data:image/png;base64,${album.albumCover}`);
  } catch (error) {
    console.error('Error retrieving album cover:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};