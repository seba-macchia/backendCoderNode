const express = require('express');
const route = express.Router();
const userControllers = require('../controllers/userControllers');

route.post('/reset-password', userControllers.requestPasswordReset);
// Ruta para cambiar el rol de usuario a premium y viceversa
route.put('/premium/:uid', userControllers.toggleUserRole);

module.exports = route;
