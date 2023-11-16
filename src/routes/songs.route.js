const express = require('express');
const router = express.Router();
const songController = require('../controllers/songs.controller');

router.get('/', songController.getAllSongs);
router.get('/filter', songController.filterSongs);
router.get('/:id', songController.getSongById);
router.post('/', songController.addSong);
router.put('/:id', songController.editSong);
router.delete('/:id', songController.deleteSong);

module.exports = router;