const express = require('express');
const router = express.Router();
const Song = require('../models/song.model');

// GET: Récupérer tous les sons
router.get('/songs', async (req, res) => {
  try {
    const songs = await Song.find();
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET: Récupérer un son par son ID
router.get('/songs/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    res.json(song);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Ajouter un nouveau son
router.post('/songs', async (req, res) => {
  const song = new Song({
    title: req.body.title,
    artist: req.body.artist,
    genre: req.body.genre,
    // Ajoutez d'autres champs nécessaires
  });

  try {
    const newSong = await song.save();
    res.status(201).json(newSong);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT: Mettre à jour un son par son ID
router.put('/songs/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (song) {
      song.title = req.body.title || song.title;
      song.artist = req.body.artist || song.artist;
      song.genre = req.body.genre || song.genre;
      // Mettez à jour d'autres champs au besoin

      const updatedSong = await song.save();
      res.json(updatedSong);
    } else {
      res.status(404).json({ message: 'Son introuvable' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE: Supprimer un son par son ID
router.delete('/songs/:id', async (req, res) => {
  try {
    const song = await Song.findById(req.params.id);
    if (song) {
      await song.remove();
      res.json({ message: 'Son supprimé avec succès' });
    } else {
      res.status(404).json({ message: 'Son introuvable' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
