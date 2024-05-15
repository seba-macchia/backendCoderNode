const express = require('express');
const { Router } = express;
const route = Router();
const { renderHomePage } = require("../controllers/homeControllers");

route.get('/', renderHomePage);

module.exports = route;
