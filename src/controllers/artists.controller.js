const Artist = require('../models/artists.model');

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
        // Ajoutez d'autres champs nécessaires
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
exports.deleteArtist = (req, res) => {
    Artist.findByIdAndDelete(req.params.id).then(
        () => res.json('Artist deleted.')
    ).catch((err) => res.status(400).json('Error: ' + err));
};
