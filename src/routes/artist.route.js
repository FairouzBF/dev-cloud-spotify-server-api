const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artist.controller');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', artistController.getArtists);
router.get('/:id', artistController.getArtistById);
router.post('/', authMiddleware, artistController.addArtist);
router.post('/file', authMiddleware, artistController.addArtistFromFile);
router.put('/:id', authMiddleware, artistController.editArtist);
router.delete('/:id', authMiddleware, artistController.deleteArtist);

module.exports = router;