const express = require('express');
const router = express.Router();
const songController = require('../controllers/song.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', songController.getAllSongs);
router.get('/filter', songController.filterSongs);
router.get('/:id', songController.getSongById);
router.post('/', songController.addSong);
router.put('/:id', songController.editSong);
router.delete('/:id', songController.deleteSong);
router.get('/protected-route', authMiddleware, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

module.exports = router;