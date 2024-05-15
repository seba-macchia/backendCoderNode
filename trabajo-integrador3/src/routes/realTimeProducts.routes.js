const express = require('express');
const { Router } = express;
const route = Router();
const {
  renderRealTimeProductsPage,
  getRealTimeProducts,
} = require("../controllers/realTimeProductsControllers.js");

route.get('/', renderRealTimeProductsPage);
route.get('/realtimeproducts', getRealTimeProducts);

module.exports = route;
