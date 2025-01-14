const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = 'uploads/';

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['.png', '.jpg', '.jpeg', '.gif', '.pdf', '.json', '.pdf'];
    const extname = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.includes(extname)) {
      return cb(null, true);
    }
    cb(new Error('Arquivo inválido! Apenas imagens e PDF são permitidos.'));
  }
});

module.exports = upload;
