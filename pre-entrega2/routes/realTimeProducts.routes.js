const express = require('express');
const { Router } = express;

const Products = require('../public/dao/db/models/productManager.js');

const routerRealTimeProducts = Router()

routerRealTimeProducts.get('/', async (req, res) => {
    try {
    
        res.status(200).render("realTimeProducts", { js: "realTimeProducts.js" });

    } catch (error) {
        console.log(`Error obteniendo los productos: ${error}`);
    }
})

routerRealTimeProducts.get('/realtimeproducts', async (req, res) => {
  try {
    const products = await Products.find();
    res.render('realTimeProducts', { products });
  } catch (error) {
    console.error(`Error al obtener productos: ${error}`);
    res.status(500).send('Error al obtener productos');
  }
});

module.exports = routerRealTimeProducts