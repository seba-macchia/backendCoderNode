const express = require('express');
const route = express.Router();
const userControllers = require('../controllers/userControllers.js');
const upload = require('../middleware/uploadMiddleware.js'); // Importa el middleware de upload

// Rutas existentes
route.get('/reset-password', userControllers.renderResetPassword);
route.post('/reset-password-email', userControllers.sendResetPasswordEmail);
route.get('/reset-password/:token', userControllers.renderNewPasswordForm);
route.post('/reset-password/:token', userControllers.resetPassword);
route.put('/premium/:uid', userControllers.toggleUserRole);
route.get('/all-users-emails', userControllers.getAllUserIdAndEmails);

// Nueva ruta para manejar la subida de documentos
route.post('/:uid/documents', upload.fields([
  { name: 'profileImage', maxCount: 1 },
  { name: 'productImage', maxCount: 1 },
  { name: 'documents', maxCount: 10 }
]), userControllers.uploadDocuments);

module.exports = route;
