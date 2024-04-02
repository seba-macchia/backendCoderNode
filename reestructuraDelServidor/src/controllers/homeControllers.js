const ProductManager = require("../services/productService");

const productManager = new ProductManager("./products.json");

async function renderHomePage(req, res) {
    try {
        const products = await productManager.getProducts();
        const user = req.user;

        res.status(200).render("home", {
          products: products,
          user: user,
        });
    } catch (error) {
        console.log(`Error obteniendo los productos: ${error}`);
    }
}

module.exports = {
  renderHomePage,
};
