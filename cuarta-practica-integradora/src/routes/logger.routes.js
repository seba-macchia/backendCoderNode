const express = require('express');
const route = express.Router();
const loggerMiddleware = require('../middleware/loggerMiddleware');
const loggerController = require('../controllers/loggerControllers');

// Use logging middleware
route.use(loggerMiddleware);

// Define the /loggerTest endpoint
route.get('/loggerTest', loggerController.loggerTest);

// Export the router
module.exports = route;