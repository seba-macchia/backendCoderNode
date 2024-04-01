const express = require("express");
const { Router } = express;
const route = Router();
const {
  getAllProducts,
  getAllProductsAPI,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productsControllers");

route.get("/", getAllProducts);
route.get("/allProducts", getAllProductsAPI);
route.get("/prodById/:productId", getProductById);
route.post("/createProd", createProduct);
route.put("/updateProd/:id", updateProduct);
route.delete("/deleteProd/:pid", deleteProduct);

module.exports = route;
