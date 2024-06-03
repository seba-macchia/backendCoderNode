const Cart = require('../models/cart.model');

class CartDAO {
  async createCart() {
    try {
      const newCart = new Cart({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      console.error('Error al crear el carrito:', error);
      throw error;
    }
  }

  async findCartByUserId(userId) {
    try {
      const cart = await Cart.findOne({ user: userId });
      return cart;
    } catch (error) {
      console.error('Error al buscar el carrito por ID de usuario:', error);
      throw error;
    }
  }

  async deleteCartById(cartId) {
    try {
      const res = await Cart.deleteOne({ _id: cartId });
      return res;
    } catch (error) {
      console.error('Error al eliminar el carrito:', error);
      throw error;
    }
  }
}

module.exports = CartDAO;
