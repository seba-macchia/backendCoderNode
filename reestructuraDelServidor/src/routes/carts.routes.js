const { Router } = require("express");
const route = new Router();
const {
  getAllCarts,
  getCartById,
  addProdToCart,
  createCart,
  deleteProductFromCart,
  deleteCart,
  updateCart,
  updateProductQuantity,
} = require("../controllers/cartsControllers.js");

route.get("/allCarts", getAllCarts);
route.get("/:cid", getCartById);
route.post("/addProdToCart/:cId/:pId", addProdToCart);
route.post("/createCart", createCart);
route.delete("/:cid/products/:pid", deleteProductFromCart);
route.delete("/:cid", deleteCart);
route.put("/:cid", updateCart);
route.put("/:cid/products/:pid", updateProductQuantity);

module.exports = route;
