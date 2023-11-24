const express = require('express');
const router = express.Router();
const songsRouter = require('./song.route');
const genresRouter = require('./genre.route');
const artistsRouter = require('./artist.route');
const albumsRouter = require('./album.route');

router.use('/song', songsRouter);
router.use('/genre', genresRouter);
router.use('/artist', artistsRouter);
router.use('/album', albumsRouter);

module.exports = router;