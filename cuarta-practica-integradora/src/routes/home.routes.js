const express = require('express');
const { Router } = express;
const route = Router();
const { renderHomePage } = require("../controllers/homeControllers.js");

route.get('/', renderHomePage);

module.exports = route;
