// cartService.js

const cartModel = require('../models/cart.model');

class CartManager {
  async getCarts() {
    try {
      return await cartModel.find();
    } catch (err) {
      console.error(err);
      return [];
    }
  }

  async getCartById(cid) {
    try {
      const cart = await cartModel.findById(cid).populate("products.product");
      if (!cart) {
        return { success: false, message: `No se encontró ningún carrito con el ID ${cid}`, data: null };
      }
      const formattedProducts = cart.products.map((item) => {
        return {
          title: item.product.title,
          quantity: item.quantity,
          description: item.product.description,
          price: item.product.price,
          priceTot: item.product.price * item.quantity,
          category: item.product.category,
          thumbnail: item.product.thumbnail
        };
      });
      return { success: true, message: `Carrito obtenido correctamente`, data: formattedProducts };
    } catch (err) {
      console.error(err);
      return { success: false, message: `Error al obtener el carrito por ID`, data: null };
    }
  }

  async deleteAllProdFromCart(cid) {
    try {
      return await cartModel.updateOne({ _id: cid }, { $set: { products: [] } });
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async delProdById(cid, pid) {
    try {
      let cart = await cartModel.findOne({ _id: cid });
      if (cart) {
        cart.products = cart.products.filter(prod => prod.product.toString() !== pid);
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

  async addProdToCart(cId, pId) {
    try {
      let cart = await cartModel.findById(cId);
      if (!cart) {
        cart = await cartModel.create({ _id: cId, products: [] });
      }
      cart.products.push({ product: pId });
      await cart.save();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async updateCartProducts(cid, data) {
    try {
      return await cartModel.updateOne({ _id: cid }, { $set: { products: data } });
    } catch (error) {
      return { success: false, message: `Error al agregar el producto por ID.`, error: error };
    }
  }

  async updateProductQuantity(cartId, productId, quantity) {
    try {
      let cart = await cartModel.findById(cartId);
      let productIndex = cart.products.findIndex(product => product.product.equals(productId));

      if (productIndex === -1) {
        cart.products.push({ product: productId, quantity: quantity });
      } else {
        cart.products[productIndex].quantity += quantity;
      }

      let resultado = await cart.save();

      return { success: true, message: `Se modificó correctamente la cantidad del producto con id ${productId}.`, data: resultado };
    } catch (error) {
      return { success: false, message: `Error al modificar la cantidad del producto por ID.`, error: error };
    }
  }

  async createCart(){
    try {
      const newCart = new cartModel({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      console.error(error);
    }
  }

  async deleteCart(cid) {
    try {
      const result = await cartModel.deleteOne({ _id: cid });
      return result.deletedCount > 0;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async updateCart(cid, newData) {
    try {
      const updatedCart = await cartModel.findByIdAndUpdate(cid, newData, { new: true });
      return updatedCart;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  
  
}

module.exports = CartManager;
