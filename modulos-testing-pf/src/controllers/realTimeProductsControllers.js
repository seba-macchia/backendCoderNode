const Products = require('../services/productService');

async function renderRealTimeProductsPage(req, res) {
    try {
        res.status(200).render("realTimeProducts", { js: "realTimeProducts.js" });
    } catch (error) {
        console.log(`Error obteniendo los productos: ${error}`);
    }
}

async function getRealTimeProducts(req, res) {
  try {
    const products = await Products.find();
    res.render('realTimeProducts', { products });
  } catch (error) {
    console.error(`Error al obtener productos: ${error}`);
    res.status(500).send('Error al obtener productos');
  }
}

module.exports = {
  renderRealTimeProductsPage,
  getRealTimeProducts,
};
