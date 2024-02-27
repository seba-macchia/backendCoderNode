const express = require('express');
const { Router } = express;

const ProductManager = require("../public/dao/db/models/productManager.js");

const productManager = new ProductManager();

const homeRouter = Router()

homeRouter.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();

        res.status(200).render("home", {
          products: products,
        });
    } catch (error) {
        console.log(`Error obteniendo los productos: ${error}`);
    }
});

homeRouter.get('/home', async (req, res) => {
  try {
    const products = await productManager.find();
    res.render('home', { products });
  } catch (error) {
    console.error(`Error al obtener productos: ${error}`);
    res.status(500).send('Error al obtener productos');
  }
});
module.exports = homeRouter