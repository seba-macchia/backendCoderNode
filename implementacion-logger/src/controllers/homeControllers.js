// homeController.js

const errorDictionary = require("../middleware/errorDictionary");
const ProductManager = require("../services/productService");
const { getLogger, levels } = require('../config/logger.config');
const logger = getLogger(process.env.NODE_ENV, levels.error);

const productManager = new ProductManager("./products.json");

async function renderHomePage(req, res) {
  try {
    logger.debug('Renderizando página de inicio...');
    const products = await productManager.getProducts();
    const user = req.user;

    logger.info('Página de inicio renderizada exitosamente.');
    res.status(200).render("home", {
      products: products,
      user: user,
    });
  } catch (error) {
    logger.error(`Error obteniendo los productos: ${error}`);
    res.status(500).send({ msg: errorDictionary.INTERNAL_SERVER_ERROR });
  }
}

module.exports = {
  renderHomePage,
};
