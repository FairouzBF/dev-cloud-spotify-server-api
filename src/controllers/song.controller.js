const fs = require('fs').promises;
const Song = require('../models/song.model');
const Artist = require('../models/artist.model');
const Album = require('../models/album.model');
const Genre = require('../models/genre.model');
const upload = require('../middleware/multer');

exports.addSong = async (req, res, next) => {
    upload.single('audio')(req, res, async (err) => {
        try {
            console.log('Received a request to add a song:', req.body);
            // Récupérez les données de la requête
            const { title, artist, album } = req.body;

            // Vérifiez si l'artiste et le genre existent
            const existingArtist = await Artist.findOne({ name: artist });
            const existingAlbum = await Album.findOne({ title: album });

            if (!existingArtist || !existingAlbum) {
                console.log('artist', existingArtist, 'album',existingAlbum);
                return res.status(404).json({ message: "L'artiste ou l'album n'existe pas." });
            }

            // Créez un nouvel objet Song avec les données fournies
            const newSong = new Song({
                title,
                artist: existingArtist._id, // Use the retrieved artist ID
                album: existingAlbum._id,
                audio: req.file.path
            });

            // Enregistrez la chanson dans la base de données
            const savedSong = await newSong.save();

            existingAlbum.songs.push(savedSong._id);
            await existingAlbum.save();

            res.status(201).json(savedSong);
        } catch (error) {
            console.error('Error while adding a song:', error);
            await fs.unlink(req.file.path);
            console.error(error);
            res.status(500).json({ message: 'Erreur lors de l\'ajout de la chanson.' });
        }
    });
};

// GET: Récupérer tous les sons
exports.getAllSongs = (req, res) => {
    Song.find().then(
        (songs) => res.json(songs)

    ).catch((err) => res.status(400).json('Error: ' + err));
};

exports.filterSongs = async (req, res) => {
    try {
        // Extract filter parameters from query
        const { artistId, genreId } = req.query;

        // Construct the filter object based on provided parameters
        const filter = {};
        if (artistId) filter.artist = artistId;
        if (genreId) filter.genre = genreId;

        // Fetch songs based on the filter
        const songs = await Song.find(filter);

        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: 'Error: ' + error.message });
    }
};
// GET: Récupérer un son par son ID
exports.getSongById = (req, res) => {
    Song.findById(req.params.id).then(
        (song) => res.json(song)

    ).catch((err) => res.status(400).json('Error: ' + err));
};

// PUT: Mettre à jour un son par son ID
exports.editSong = (req, res) => {
    Song.findById(req.params.id).then(
        (song) => {
            song.title = req.body.title;
            song.artist = req.body.artist;
            song.genre = req.body.genre;
            // Mettez à jour d'autres champs au besoin
            song.save().then(
                () => res.json('Song updated!')

            ).catch((err) => res.status(400).json('Error: ' + err));
        }
    ).catch((err) => res.status(400).json('Error: ' + err));
};

// DELETE: Supprimer un son par son ID
exports.deleteSong = (req, res) => {
    Song.findByIdAndDelete(req.params.id).then(
        () => res.json('Song deleted.')

    ).catch((err) => res.status(400).json('Error: ' + err));
};