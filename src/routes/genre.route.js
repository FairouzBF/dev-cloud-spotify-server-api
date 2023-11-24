const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genre.controller');

router.get('/', genreController.getGenres);
router.get('/:id', genreController.getGenreById);
router.post('/', genreController.addGenre);
router.put('/:id', genreController.editGenre);
router.delete('/:id', genreController.deleteGenre);

module.exports = router;