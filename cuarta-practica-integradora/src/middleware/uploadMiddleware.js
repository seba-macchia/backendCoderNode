const multer = require('multer');
const { format } = require('date-fns');
const path = require('path');
const fs = require('fs');

// Función para normalizar nombres de archivos
const normalizeFileName = (fileName) => {
  const noNumberFileName = fileName.replace(/^\d+-/, "");
  return noNumberFileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9\.]/g, "_")
    .toLowerCase();
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'documents';
    if (file.fieldname === 'profileImage') {
      folder = 'profiles';
    } else if (file.fieldname === 'productImage') {
      folder = 'products';
    }
    const uploadPath = path.join(__dirname, '../../uploads', folder);
    fs.mkdirSync(uploadPath, { recursive: true }); // Crear la carpeta si no existe
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const now = new Date();
    const formattedDate = format(now, 'ddMMyyyy-HHmmss');
    const normalizedFileName = normalizeFileName(file.originalname);
    const finalFileName = `${formattedDate}-${normalizedFileName}`;
    cb(null, finalFileName);
  }
});

const upload = multer({ storage: storage });

module.exports = upload;
