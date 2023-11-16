const express = require('express');
const router = express.Router();
const songsRouter = require('./songs.route');
const genresRouter = require('./genres.route');
const artistsRouter = require('./artists.route');

router.use('/songs', songsRouter);
router.use('/genres', genresRouter);
router.use('/artists', artistsRouter);

module.exports = router;