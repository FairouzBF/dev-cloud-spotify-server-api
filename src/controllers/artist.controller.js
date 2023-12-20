const Artist = require('../models/artist.model');
const Album = require('../models/album.model');
const Song = require('../models/song.model');

const { createArtistFromFile } = require('../utils/fileCreator');

exports.addArtistFromFile = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const filePath = req.body.filePath;

        console.log('Creating artist from folder:', filePath);
        const artistId = await createArtistFromFile(filePath);

        if (artistId) {
            return res.status(200).json({ message: 'Artist already exists', artistId });
        }
        
        return res.status(200).json({ message: 'Artist created from folder successfully', artistId });
    } catch (error) {
        console.error('Error creating artist from folder:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// GET: Récupérer tous les sons
exports.getArtists = (req, res) => {
    Artist.find().then(
        (artists) => res.json(artists)
    ).catch((err) => res.status(400).json('Error: ' + err))
};

// GET: Récupérer un son par son ID
exports.getArtistById = (req, res) => {
    Artist.findById(req.params.id).then(
        (artists) => res.json(artists)
    ).catch((err) => res.status(400).json('Error: ' + err));
};

// POST: Ajouter un nouveau son
exports.addArtist = (req, res) => {
    const artist = new Artist({
        name: req.body.name,
    });
    artist.save().then(
        () => res.json('Artist added!')
    ).catch((err) => res.status(400).json('Error: ' + err));
};

// PUT: Mettre à jour un son par son ID
exports.editArtist = (req, res) => {
    Artist.findById(req.params.id).then(
        (artists) => {
            artists.name = req.body.name;
            // Mettez à jour d'autres champs au besoin
            artists.save().then(
                () => res.json('Artist updated!')

            ).catch((err) => res.status(400).json('Error: ' + err));
        }
    ).catch((err) => res.status(400).json('Error: ' + err));
};

// DELETE: Supprimer un son par son ID
exports.deleteArtist = async (req, res) => {
    try {
      // Find and store the artist to get the linked albums
      const artist = await Artist.findById(req.params.id);
  
      if (!artist) {
        return res.status(404).json({ message: 'Artist not found.' });
      }
  
      // Store the linked albums and songs
      const linkedAlbums = artist.albums;
  
      // Delete the artist from the database
      const deletedArtist = await Artist.findByIdAndDelete(req.params.id);
  
      // Delete the linked albums and their songs
      if (linkedAlbums && linkedAlbums.length > 0) {
        // Find and store the linked songs of each album
        const linkedSongs = await Song.find({ album: { $in: linkedAlbums } });
  
        // Delete the linked albums
        await Album.deleteMany({ _id: { $in: linkedAlbums } });
  
        // Delete the linked songs
        if (linkedSongs && linkedSongs.length > 0) {
          await Song.deleteMany({ _id: { $in: linkedSongs.map(song => song._id) } });
        }
      }
  
      res.json(deletedArtist);
    } catch (error) {
      console.error('Error while deleting an artist:', error);
      res.status(500).json({ message: 'Error while deleting an artist.' });
    }
  };
