const { Router } = require("express");
const route = new Router();
const { isAdmin, isUser, isPremiumOrUser} = require("../middleware/authMiddleware.js");
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

route.get("/allCarts", getAllCarts); // Solo el administrador puede ver todos los carritos
route.get("/:cid", isPremiumOrUser, showCart); // Solo el usuario puede ver un carrito
route.post("/addProdToCart/:cId/:pId", isPremiumOrUser, addProductToCart); // Solo el usuario puede agregar productos al carrito
route.post("/createCart", createCart);
route.delete("/:cid/products/:pid", isPremiumOrUser, cartManager.delProdById); // Solo el administrador puede eliminar productos del carrito
route.delete("/:cid",  isAdmin, deleteCart); // Solo el administrador puede eliminar carritos
route.post("/:cid/products", isPremiumOrUser, deleteAllProductsFromCart); 
route.put("/:cid", isAdmin, cartManager.updateCart); // Solo el administrador puede actualizar carritos
route.put("/:cid/products/:pid", isPremiumOrUser, updateProductQuantity); // Solo el usuario puede actualizar productos del carrito
route.post("/:cid/purchase", isPremiumOrUser, purchaseCart); 

module.exports = route;
