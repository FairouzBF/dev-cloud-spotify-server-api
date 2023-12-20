const Album = require('../models/album.model');
const Artist = require('../models/artist.model');
const Song = require('../models/song.model');
const mm = require('music-metadata');

async function createAlbumFromFile(filePath) {
  try {
    const metadata = await mm.parseFile(filePath);
    const existingAlbum = await Album.findOne({name: metadata.common.album});

    if (existingAlbum) {
      console.error('Album already exists:', existingAlbum);
      return existingAlbum._id;
    }

    console.log(
      `Album ${metadata.common.album} does not exist, adding it to the DB...`,
    );
    console.log('Checking for artist...');
    let existingArtist = await Artist.findOne({name: metadata.common.artist});

    if (!existingArtist) {
      console.log(
        `Artist ${metadata.common.artist} does not exist, adding them to the DB...`,
      );
      const newArtist = new Artist({
        name: metadata.common.artist,
      });

      existingArtist = await newArtist.save();
      console.log('Artist created successfully!');
    }

    console.log('Adding the album to the DB...');
    const album = new Album({
      title: metadata.common.album,
      artist: existingArtist._id,
      releaseDate: metadata.common.year,
      songs: [],
      albumCover: metadata.common.picture[0].data.toString('base64'),
    });

    await album.save();
    console.log('Album created successfully!');

    existingArtist.albums.push(album._id);
    await existingArtist.save();
    console.log('Album linked to artist successfully!');

    return album._id;
  } catch (error) {
    console.error(`Error creating album from file ${filePath}:`, error.message);
    throw error;
  }
}

async function importSongFromFile(filePath) {
    try {
      const metadata = await mm.parseFile(filePath);
      console.log('Reading metadata...', metadata.common);
  
      const {title, artist, album} = metadata.common;
  
      console.log('Checking for album...');
      let existingAlbum = await Album.findOne({name: album});
  
      if (!existingAlbum) {
        const albumId = await createAlbumFromFile(filePath);
        existingAlbum = await Album.findById(albumId);
      }
  
      // If the artist didn't exist before this, it's already been created with the createAlbumFromFile function
      let existingArtist = await Artist.findOne({name: artist});
  
      const newSong = new Song({
        title,
        artist: existingArtist._id,
        album: existingAlbum._id,
        albumCover: metadata.common.picture[0].data.toString('base64'),
        audio: filePath,
      });
  
      const savedSong = await newSong.save();
  
      existingAlbum.songs.push(savedSong._id);
      await existingAlbum.save();
      console.log('Song linked to album successfully!');
      existingArtist.songs.push(savedSong._id);
      await existingArtist.save();
      console.log('Song linked to artist successfully!');
    } catch (error) {
      console.error(`Error creating album from file ${filePath}:`, error.message);
      throw error;
    }
  }

module.exports = {
  createAlbumFromFile, importSongFromFile,
};
