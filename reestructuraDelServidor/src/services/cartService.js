const Cart = require("../models/cart.model");

class CartManager {
  constructor() {
    this.cart = [];
  }

  async getCarts() {
    try {
      this.cart = Cart.find();
      return this.cart;
    } catch (err) {
      console.error(err);
      return [];
    }
  }
  async addCart() {
    try {
      const cart = await Cart.create({ products: [] });
      await cart.save();
      return cart;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async getCartById(id) {
    try {
      let carrito = await Cart.findById(id).populate("products.product")

      let nuevoArray = carrito.products.map((item) => {
        return {
            title: item.product.title,
            quantity: item.quantity,
            description: item.product.description,
            price: item.product.price,
            priceTot: item.product.price * item.quantity,
            category: item.product.category,
            thumbnail: item.product.thumbnail
        }
    })

    return { success: true, message: `Carrito obtenido correctamente`, data: nuevoArray }
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async deleteAllProdFromCart(cid) {
    try {
      let res = await Cart.updateOne({ _id: cid }, { $set: { products: [] } });
      return res;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  async delProdById(cid, pid) {
    try {
      let cart = await Cart.findOne({ _id: cid });
      if (cart) {
        cart.products = cart.products.filter(
          (prod) => prod.product.toString() !== pid
        );
        await cart.save();
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async addProdsToCart(cId, prods) {
    try {
      this.cart = await Cart.findOne({ _id: cId });
      prods.forEach(async (prod) => {
        this.cart.products.push({ product: prod.id });
      });
      await this.cart.save();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async addProdToCart(cId, pId) {
    try {
      this.cart = await Cart.findOne({ _id: cId });
      this.cart.products.push({ product: pId });
      await this.cart.save();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async updateCartProducts(cid, data) {
    try {
        let result = await Cart.updateOne({ _id: cid }, { $set: { products: data } })
        return { success: true, message: `El carrito con id ${cid} se agregó correctamente.`, data: result }

    } catch (error) {
        // Captura y manejo de errores durante la obtención de un carrito por ID.
        return { success: false, message: `Error al agregar el producto por ID.`, error: error }
    }
}


async updateProductQuantity(cartId, productId, quantity) {
  try {
    // Buscar el carrito por su ID
    let cart = await Cart.findById(cartId);

    // Buscar el índice del producto dentro del carrito
    let productIndex = cart.products.findIndex(product => product.product.equals(productId));

    if (productIndex === -1) {
      // Si el producto no existe en el carrito, agregarlo con la cantidad proporcionada
      cart.products.push({ product: productId, quantity: quantity });
    } else {
      // Si el producto ya existe en el carrito, incrementar la cantidad
      cart.products[productIndex].quantity += quantity; // Incremento en la cantidad existente
    }

    // Guardar los cambios en el carrito
    let resultado = await cart.save();

    return { success: true, message: `Se modificó correctamente la cantidad del producto con id ${productId}.`, data: resultado };
  } catch (error) {
    // Captura y manejo de errores durante la obtención o modificación del carrito
    return { success: false, message: `Error al modificar la cantidad del producto por ID.`, error: error };
  }
}


}

module.exports = CartManager;