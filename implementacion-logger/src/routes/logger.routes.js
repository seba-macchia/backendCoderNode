const express = require('express');
const router = express.Router();
const loggerMiddleware = require('../middleware/loggerMiddleware');
const loggerController = require('../controllers/loggerControllers');
const loggerConfig = require('../config/logger.config');

// Usar el middleware de registro
router.use(loggerMiddleware);

// Definir el endpoint /loggerTest
router.get('/loggerTest', loggerController.loggerTest);

// Exportar las rutas
module.exports = router;
