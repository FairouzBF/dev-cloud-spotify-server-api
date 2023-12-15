const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genre.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', genreController.getGenres);
router.get('/:id', genreController.getGenreById);
router.post('/', authMiddleware, genreController.addGenre);
router.put('/:id', authMiddleware, genreController.editGenre);
router.delete('/:id', authMiddleware, genreController.deleteGenre);

module.exports = router;