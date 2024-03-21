const express = require('express');
const { Router } = express;

const ProductManager = require("../db/productManager");

const productManager = new ProductManager("./products.json");

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

module.exports = homeRouter