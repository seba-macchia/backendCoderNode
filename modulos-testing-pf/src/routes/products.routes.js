const express = require("express");
const { Router } = express;
const { isAdmin, isPremium, isAdminOrPremium } = require("../middleware/authMiddleware"); // Importar el middleware de autorización
const route = Router();
const {
  getAllProducts,
  getAllProductsAPI,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  renderManagerPage,
  generateSimulatedProducts
} = require("../controllers/productsControllers");

route.get("/", getAllProducts);
route.get("/allProducts",  isAdminOrPremium, getAllProductsAPI);
route.get("/prodById/:productId", getProductById);
route.get("/manager/", isAdminOrPremium, renderManagerPage);
route.post("/createProd", isAdminOrPremium, createProduct); // Aplicar middleware de autorización para crear producto (solo para administradores)
route.put("/updateProd/:id", isAdminOrPremium, updateProduct); // Aplicar middleware de autorización para actualizar producto (solo para administradores)
route.delete("/deleteProd/:id", isAdminOrPremium, deleteProduct); // Aplicar middleware de autorización para eliminar producto (solo para administradores)
// Ruta para obtener productos simulados
route.get('/mockingproducts', generateSimulatedProducts);

module.exports = route;
