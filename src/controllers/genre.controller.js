const Genre = require('../models/genre.model');

// GET: Récupérer tous les sons
exports.getGenres = (req, res) => {
    Genre.find().then(
        (genres) => res.json(genres)
    ).catch((err) => res.status(400).json('Error: ' + err))
};

// GET: Récupérer un son par son ID
exports.getGenreById = (req, res) => {
    Genre.findById(req.params.id).then(
        (genres) => res.json(genres)
    ).catch((err) => res.status(400).json('Error: ' + err));
};

// POST: Ajouter un nouveau son
exports.addGenre = (req, res) => {
    const genre = new Genre({
        name: req.body.name,
        // Ajoutez d'autres champs nécessaires
    });
    genre.save().then(
        () => res.json('Genre added!')
    ).catch((err) => res.status(400).json('Error: ' + err));
};

// PUT: Mettre à jour un son par son ID
exports.editGenre = (req, res) => {
    Genre.findById(req.params.id).then(
        (genre) => {
            genre.name = req.body.name;
            // Mettez à jour d'autres champs au besoin
            genre.save().then(
                () => res.json('Genre updated!')

            ).catch((err) => res.status(400).json('Error: ' + err));
        }
    ).catch((err) => res.status(400).json('Error: ' + err));
};

// DELETE: Supprimer un son par son ID
exports.deleteGenre = (req, res) => {
    Genre.findByIdAndDelete(req.params.id).then(
        () => res.json('Genre deleted.')

    ).catch((err) => res.status(400).json('Error: ' + err));
};
