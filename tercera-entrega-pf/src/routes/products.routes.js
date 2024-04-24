const express = require("express");
const { Router } = express;
const route = Router();
const {isAdmin} = require("../middleware/authMiddleware"); // Importar el middleware de autorización
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
route.post("/createProd", isAdmin, createProduct); // Aplicar middleware de autorización para crear producto (solo para administradores)
route.put("/updateProd/:id", isAdmin, updateProduct); // Aplicar middleware de autorización para actualizar producto (solo para administradores)
route.delete("/deleteProd/:pid", isAdmin, deleteProduct); // Aplicar middleware de autorización para eliminar producto (solo para administradores)

module.exports = route;
