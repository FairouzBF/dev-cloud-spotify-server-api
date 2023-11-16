const Song = require('../models/songs.model');

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

// POST: Ajouter un nouveau son
exports.addSong = async (req, res) => {
    const { title, artistId, genreId } = req.body;

    try {
        // Check if the provided artistId and genreId are valid ObjectId strings
        if (!mongoose.Types.ObjectId.isValid(artistId) || !mongoose.Types.ObjectId.isValid(genreId)) {
            return res.status(400).json('Invalid artistId or genreId');
        }

        // Check if the artist and genre exist
        const artist = await Artist.findById(artistId);
        const genre = await Genre.findById(genreId);

        if (!artist || !genre) {
            return res.status(404).json('Artist or genre not found');
        }

        // Create a new song with the provided information
        const song = new Song({
            title,
            artist: artistId,
            genre: genreId,
            // Add other fields as needed
        });

        // Save the song to the database
        const newSong = await song.save();
        res.status(201).json(newSong);
    } catch (error) {
        res.status(400).json('Error: ' + error.message);
    }
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