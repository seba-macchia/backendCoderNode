const express = require("express");
const { Router } = express;
const route = new Router();
const {
  renderLoginPage,
  renderRegisterPage,
  renderProfilePage,
  auth,
} = require("../controllers/mainControllers.js");
const productsRoutes = require("./products.routes.js");
const cartsRoutes = require("./carts.routes.js");
const authRoutes = require("./auth.routes.js");
const swaggerRoutes = require("./swagger.routes.js");

// Monta las rutas de autenticación
route.use("/api/sessions", authRoutes);

// Monta las rutas de productos
route.use("/api/products", productsRoutes);

// Monta las rutas de carritos
route.use("/api/carts", cartsRoutes);

// Rutas exclusivas para Swagger sin autenticación
route.use("/api/swagger", swaggerRoutes);

route.get("/", renderLoginPage);
route.get("/login", renderLoginPage);
route.get("/register", renderRegisterPage);
route.get("/profile", auth, renderProfilePage);

module.exports = route;
