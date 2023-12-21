const fs = require('fs');
const path = require('path');
const mm = require('music-metadata');
const mongoose = require('mongoose');
const Artist = require('../models/artist.model');
const Album = require('../models/album.model');
const Song = require('../models/song.model');

const folderPath = path.join(__dirname, '../../0001. Frank Sinatra - In The Wee Small Hours (1955)');

async function readMetadata(filePath) {
  try {
    const metadata = await mm.parseFile(filePath);
    return metadata;
  } catch (error) {
    console.error('Error reading metadata:', error.message);
    throw error;
  }
};

async function readFolderMetadata(folderPath) {
  try {
    // Read the content of the folder
    const files = fs.readdirSync(folderPath);

    // Ensure that there is at least one file in the folder
    if (files.length === 0) {
      throw new Error('Folder is empty.');
    }

    // Construct the file path of the first file in the folder
    const filePath = path.join(folderPath, files[0]);

    // Read metadata of the first file
    const metadata = await mm.parseFile(filePath);

    return metadata;
  } catch (error) {
    console.error('Error reading metadata:', error.message);
    throw error;
  }
}

async function createArtist(filePath) {
  try {
    const metadata = await readFolderMetadata(filePath);

    const artist = new Artist({
      name: metadata.common.artist,
      albums: [],
      songs: [],
    });

    await artist.save();
    console.log('Artist created successfully:', artist);
    return artist._id;
  } catch (error) {

    console.error(`Error creating artist for file ${filePath}:`, error.message);
    throw error;
  }
};

async function createAlbum(filePath, artist) {
  try {
    const metadata = await readFolderMetadata(filePath);

    const album = new Album({
      title: metadata.common.album,
      artist: artist._id,
      releaseDate: metadata.common.year,
      songs: [],
    });

    await album.save();
    console.log('Album created successfully:', album);
    return album._id;
  } catch (error) {

    console.error(`Error creating album for file ${filePath}:`, error.message);
    throw error;
  }
};

async function createSong(filePath, artist, album) {
  try {
    const metadata = await readMetadata(filePath);

    const song = new Song({
      title: metadata.common.title || path.basename(filePath, path.extname(filePath)),
      artist: artist._id,
      album: album._id,
      audio: path.basename(filePath),
    });

    await song.save();

    await Artist.findByIdAndUpdate(artist._id, { $push: { songs: song._id } });
    await Album.findByIdAndUpdate(album._id, { $push: { songs: song._id } });

    console.log('Song created successfully:', song);

    return song._id;
  } catch (error) {
    console.error(`Error creating song for file ${filePath}:`, error.message);
    throw error;
  }
};

async function processSongs(folderPath, artist, album) {
  try {
    // Read the content of the folder
    const files = await fs.promises.readdir(folderPath);

    // Loop through each file
    for (const file of files) {
      const filePath = path.join(folderPath, file);

      try {
        // Create each song individually
        await createSong(filePath, artist, album);
      } catch (error) {
        // Handle errors during song creation
        console.error(`Error processing file ${file}:`, error.message);
      }
    }
  } catch (error) {
    console.error('Error processing songs:', error.message);
  }
};

async function processFolder(folderPath) {
  try {
    // Create the artist
    const artistId = await createArtist(folderPath);

    // Create the album
    const albumId = await createAlbum(folderPath, artistId);

    // Process songs
    await processSongs(folderPath, artistId, albumId);
  } catch (error) {
    console.error('Error processing folder:', error.message);
  }
};

processFolder(folderPath);

async function readMetadataForAllSongs() {
  try {
    // Read the contents of the directory
    const files = fs.readdirSync(folderPath);

    // Loop through each file
    for (const file of files) {
      const filePath = path.join(folderPath, file);

      try {
        // Read metadata for each file
        const metadata = await mm.parseFile(filePath);
        console.log(`Metadata for ${file}:`, metadata.format.trackInfo[0]);
      } catch (error) {
        console.error(`Error reading metadata for ${file}:`, error.message);
      }
    }
  } catch (error) {
    console.error('Error reading directory:', error.message);
  }
}

// Appeler la fonction avec le chemin du dossier de l'album
//processAlbumFolder(folderPath);
readMetadataForAllSongs();
