const express = require('express');
const router = express.Router();
const loggerMiddleware = require('../middleware/loggerMiddleware');
const loggerController = require('../controllers/loggerControllers');

// Use logging middleware
router.use(loggerMiddleware);

// Define the /loggerTest endpoint
router.get('/loggerTest', loggerController.loggerTest);

// Export the router
module.exports = router;