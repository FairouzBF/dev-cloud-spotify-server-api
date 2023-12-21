const Album = require('../models/album.model');
const Artist = require('../models/artist.model');
const Song = require('../models/song.model');
const mm = require('music-metadata');
const fs = require('fs').promises;
const path = require('path');

async function saveImage(picture) {
  const extension = picture.format.split('/')[1];
  const fileName = `${Date.now()}.${extension}`;
  const relativePath = path.join('covers', fileName);
  const imagePath = path.join(process.cwd(),  relativePath);
  await fs.writeFile(imagePath, picture.data);
  console.log('Cover saved successfully:', relativePath);

  return relativePath;
}

async function createArtistFromFile(file) {
  try {
      const metadata = await mm.parseFile(file);
      console.log('Metadata:', metadata);

      const existingArtist = await Artist.findOne({ name: metadata.common.artist });

      if (existingArtist) {
          console.error('Artist already exists:', existingArtist);
          return existingArtist._id;
      }

      const artist = new Artist({
          name: metadata.common.artist,
          albums: [],
          songs: [],
      });

      await artist.save();
      console.log('Artist created successfully from folder:', artist);

      return artist._id;
  } catch (error) {
      console.error(`Error creating artist from folder ${file}:`, error.message);
      throw error;
  }
}

async function createAlbumFromFile(filePath) {
  try {
    const metadata = await mm.parseFile(filePath);
    const existingAlbum = await Album.findOne({title: metadata.common.album});

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
    const albumCoverPath = await saveImage(metadata.common.picture[0]);
    const urlFriendlyAlbumCoverPath = albumCoverPath.replace(/\\/g, '/');
    const album = new Album({
      title: metadata.common.album,
      artist: existingArtist._id,
      artistName: metadata.common.artist,
      releaseDate: metadata.common.year,
      songs: [],
      albumCover: urlFriendlyAlbumCoverPath,
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
      const existingSong = await Song.findOne({title: title});

      if (existingSong) {
        console.error('Song already exists:', existingSong);
        return { message: 'Song already exists', existingSongId: existingSong._id };
      }
  
      console.log('Checking for album...');
      let existingAlbum = await Album.findOne({name: album});
  
      if (!existingAlbum) {
        const albumId = await createAlbumFromFile(filePath);
        existingAlbum = await Album.findById(albumId);
      }
  
      // If the artist didn't exist before this, it's already been created with the createAlbumFromFile function
      let existingArtist = await Artist.findOne({artistName: artist});

      if (!existingArtist) {
        const artistId = await createArtistFromFile(filePath);
        existingArtist = await Artist.findById(artistId);
      }
 
      const newSong = new Song({
        title,
        artist: existingArtist._id,
        artistName: artist,
        album: existingAlbum._id,
        albumTitle: album,
        albumCover: existingAlbum.albumCover,
        audio: filePath,
        duration: metadata.format.duration,
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
  createAlbumFromFile, importSongFromFile, createArtistFromFile
};
