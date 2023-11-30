
const Artist = require('../models/artist.model');
const mm = require('music-metadata');

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

async function createArtistFromFile(filePath) {
    try {
        const metadata = await mm.parseFile(filePath);
        console.log('Metadata:', metadata);

        const artist = new Artist({
            name: metadata.common.artist,
            albums: [],
            songs: [],
        });

        await artist.save();
        console.log('Artist created successfully from folder:', artist);

        return artist._id;
    } catch (error) {
        console.error(`Error creating artist from folder ${filePath}:`, error.message);
        throw error;
    }
}

exports.addArtistFromFile = async (req, res) => {
    try {
        console.log('Request body:', req.body);
        const filePath = req.body.filePath;

        console.log('Creating artist from folder:', filePath);
        const artistId = await createArtistFromFile(filePath);

        return res.status(200).json({ message: 'Artist created from folder successfully', artistId });
    } catch (error) {
        console.error('Error creating artist from folder:', error.message);
        return res.status(500).json({ error: 'Internal server error' });
    }
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
exports.deleteArtist = (req, res) => {
    Artist.findByIdAndDelete(req.params.id).then(
        () => res.json('Artist deleted.')
    ).catch((err) => res.status(400).json('Error: ' + err));
};
