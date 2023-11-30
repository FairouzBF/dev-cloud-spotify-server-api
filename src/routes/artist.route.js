const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artist.controller');

router.get('/', artistController.getArtists);
router.get('/:id', artistController.getArtistById);
router.post('/', artistController.addArtist);
router.post('/file', artistController.addArtistFromFile);
router.put('/:id', artistController.editArtist);
router.delete('/:id', artistController.deleteArtist);

module.exports = router;