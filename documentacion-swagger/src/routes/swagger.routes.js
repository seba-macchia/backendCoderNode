const express = require("express");
const route = express.Router();

const {
  getAllProductsAPI,
  getProductById,
  renderManagerPage,
  createProduct,
  updateProduct,
  deleteProduct,
  generateSimulatedProducts
} = require("../controllers/productsControllers");

const {
  getAllCarts,
  createCart,
  deleteCart,
  addProductToCart,
  updateCart,
  deleteAllProductsFromCart,
  purchaseCart,
  updateProductQuantity,
  showCart,
} = require("../controllers/cartsControllers.js");
const CartManager = require("../services/cartService.js");
const cartManager = new CartManager();

// Rutas de productos exclusivas para Swagger (sin autenticación)
route.get("/allProducts", getAllProductsAPI);
route.get("/prodById/:productId", getProductById);
route.get("/manager/", renderManagerPage);
route.post("/createProd", createProduct);
route.put("/updateProd/:id", updateProduct);
route.delete("/deleteProd/:id", deleteProduct);
route.get('/mockingproducts', generateSimulatedProducts);

// Rutas de carritos exclusivas para Swagger (sin autenticación)
route.get("/allCarts", getAllCarts);
route.get("/:cid", showCart);
route.post("/addProdToCart/:cId/:pId", addProductToCart); 
route.post("/createCart", createCart);
route.delete("/:cid", deleteCart); 
route.post("/:cid/products", deleteAllProductsFromCart);
route.put("/:cid", cartManager.updateCart); 
route.put("/:cid/products/:pid", updateProductQuantity); 
route.post("/:cid/purchase", purchaseCart); 

module.exports = route;
