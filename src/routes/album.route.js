const express = require('express');
const router = express.Router();
const albumController = require('../controllers/album.controller');

router.get('/', albumController.getAllAlbums);
router.get('/:id', albumController.getAlbumById);
router.post('/', albumController.addAlbum);
router.post('/file', albumController.addAlbumFromFile);
router.put('/:id', albumController.editAlbum);
router.delete('/:id', albumController.deleteAlbum);

module.exports = router;
