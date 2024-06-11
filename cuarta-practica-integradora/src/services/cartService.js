// cartService.js
const errorDictionary = require('../middleware/errorDictionary');
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
      const cart = await cartModel.findOne({ _id: cid }).populate("products.product");
      if (!cart) {
        const message = errorDictionary.NOTCART_OBTAINED_ID;
        return { success: false, message, data: null };
      }
      
      const formattedProducts = cart.products.map((item) => {
        return {
          _id: item.product ? item.product._id : null,
          title: item.product ? item.product.title : null,
          quantity: item.quantity,
          description: item.product ? item.product.description : null,
          price: item.product ? item.product.price : null,
          priceTot: item.product ? item.product.price * item.quantity : null,
          category: item.product ? item.product.category : null,
          thumbnail: item.product ? item.product.thumbnail : null
        };
      });
      
      const message = errorDictionary.CART_OBTAINED_FOUND;
      return { _id: cart._id, success: true, message, products: formattedProducts };
    } catch (err) {
      console.error(err);
      const message = errorDictionary.NOTCART_OBTAINED_ID;
      return { _id: null, success: false, message, data: null };
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
        const pidString = pid.toString();
        cart.products = cart.products.filter(product => product.product.toString() !== pidString);
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
  async addProdToCart(cId, pId, quantity) {
    try {
      let cart = await cartModel.findById(cId);
      if (!cart) {
        cart = await cartModel.create({ products: [] });
      }
      cart.products.push({ product: pId, quantity: quantity }); // Incluye la cantidad del producto
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
      return { success: false, message: errorDictionary.ERROR_APPEND_PRODUCT_ID, error: error };
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
      return { success: false, message: errorDictionary.ERROR_MODIFY_AMOUNT_PRODUCT_ID, error: error };
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