const multer = require('multer');
const path = require('path');

// Configuration de Multer pour gérer les fichiers m4a
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/'); // Définissez le répertoire de destination pour les fichiers m4a
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Utilisez un nom de fichier unique basé sur la date
    }
});

const upload = multer({ storage: storage }).single('audio');

module.exports = upload;