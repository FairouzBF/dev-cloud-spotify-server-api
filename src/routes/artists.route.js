const express = require('express');
const router = express.Router();
const artistController = require('../controllers/artists.controller');

router.get('/', artistController.getArtists);
router.get('/:id', artistController.getArtistById);
router.post('/', artistController.addArtist);
router.put('/:id', artistController.editArtist);
router.delete('/:id', artistController.deleteArtist);

module.exports = router;