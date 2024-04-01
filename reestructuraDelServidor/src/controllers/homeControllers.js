const ProductManager = require("../services/productService");

const productManager = new ProductManager("./products.json");

async function renderHomePage(req, res) {
    try {
        const products = await productManager.getProducts();

        res.status(200).render("home", {
          products: products,
        });
    } catch (error) {
        console.log(`Error obteniendo los productos: ${error}`);
    }
}

module.exports = {
  renderHomePage,
};
