const express = require('express');
const router = express.Router();
const songController = require('../controllers/song.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', songController.getAllSongs);
router.get('/filter', songController.filterSongs);
router.get('/:id', songController.getSongById);
router.post('/', authMiddleware, songController.addSong);
router.put('/:id', authMiddleware, songController.editSong);
router.delete('/:id', authMiddleware, songController.deleteSong);

module.exports = router;
