const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de Multer
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
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

module.exports = upload;
