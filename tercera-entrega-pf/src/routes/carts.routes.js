const { Router } = require("express");
const route = new Router();
const { isAdmin, isUser } = require("../middleware/authMiddleware.js");
const {
  getAllCarts,
  createCart,
  deleteCart,
  updateCart,
  purchaseCart,
  updateProductQuantity,
} = require("../controllers/cartsControllers.js");
const CartManager = require("../services/cartService.js");
const cartManager = new CartManager();

route.get("/allCarts", getAllCarts); // Solo el administrador puede ver todos los carritos
route.get("/:cid", isUser, cartManager.getCartById);
route.post("/addProdToCart/:cId/:pId", isUser, cartManager.addProdToCart); // Solo el usuario puede agregar productos al carrito
route.post("/createCart", createCart);
route.delete("/:cid/products/:pid", isUser, cartManager.delProdById); // Solo el administrador puede eliminar productos del carrito
route.delete("/:cid", isAdmin, deleteCart); // Solo el administrador puede eliminar carritos
route.put("/:cid", isAdmin, cartManager.updateCart); // Solo el administrador puede actualizar carritos
route.put("/:cid/products/:pid", isUser, updateProductQuantity); // Solo el usuario puede actualizar productos del carrito
route.put("/:cid/purchase", isUser, purchaseCart); 

module.exports = route;
