const Cart = require('../models/cartManager.model');

class CartManager {
  constructor() {
    this.cart = [];
  }

    // Método para obtener todos los carritos en la base de datos
    async getCarts() {
      try {
        this.Cart = await Cart.find();
        return this.Cart;
      } catch (error) {
        console.error('Error al obtener carritos:', error);
        return [];
      }
    }
  
    // Método para agregar un nuevo carrito a la base de datos
    // async addCart(newCart) {
    //   try {
    //     const cart = new Cart(newCart);
    //     await cart.save();
    //     return cart;
    //   } catch (error) {
    //     console.error('Error al agregar carrito:', error);
    //   }
    // }

    async addCart(newCart) {
      try {
        const cart = new Cart(newCart);
        await cart.save();
        console.log('Cart added successfully:', cart);
        return cart;
      } catch (error) {
        console.error('Error al agregar carrito:', error);
      }
    }
    
  
    // Método para obtener un carrito por su ID, incluyendo los detalles de los productos asociados
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
  
      return { success: true, message: 'Carrito obtenido correctamente', data: nuevoArray }
      } catch (err) {
        console.error(err);
        return false;
      }
    }
  
    // Método para eliminar todos los productos de un carrito
    async deleteAllProdFromCart(cid) {
      try {
        let res = await Cart.updateOne({ _id: cid }, { $set: { products: [] } });
        return res;
      } catch (error) {
        console.log('Error al borrar todos los productos del carrito:', error);
      }
    }
  
    // Método para eliminar un producto específico de un carrito por su ID
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

    async addProductToCart(cId, pId) {
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
  
    // Método para actualizar la cantidad de un producto en un carrito
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
        return { success: false, message: 'Error al modificar la cantidad del producto por ID.', error: error };
      }
    }
    
  }

module.exports = CartManager;

  // Método para agregar productos a un carrito
    // async addProductsToCart(cartId, prods) {
    //   try {
    //     this.cart = await Cart.findOne({ _id: cartId });
    //     prods.forEach(async (prod) => {
    //       this.cart.products.push({ product: prod.id });
    //     });
    //     await this.cart.save();
    //     return this.cart;
    //   } catch (err) {
    //     console.error('Error al agregar productos al carrito:', err);
    //   }
    // }

// ENTREGA ANTERIOR
// class CartManager {
//   async getCarts() {
//     try {
//       const carts = await Cart.find();
//       return carts;
//     } catch (error) {
//       console.error('Error al obtener carritos:', error);
//       throw error;
//     }
//   }

//   async getCartsProducts(id) {
//     try {
//       const cart = await Cart.findById(id);
//       if (cart) {
//         return cart.productos; // Cambiado a 'productos'
//       } else {
//         console.log('Carrito no encontrado');
//         return null;
//       }
//     } catch (error) {
//       console.error('Error al obtener productos del carrito:', error);
//       throw error;
//     }
//   }

//   addCart = async () => {
//     try {
//       const newCart = new Cart({ productos: [] }); // Cambiado a 'productos'
//       await newCart.save();
//       return newCart;
//     } catch (error) {
//       console.error('Error al agregar carrito:', error);
//     }
//   }


//   async addProductToCart(cartId, productId) {
//     try {
//       const cart = await Cart.findOne({ _id: cartId });

//       if (cart) {
//         const existingProduct = cart.productos.find(item => item.productId.toString() === productId);

//         if (existingProduct) {
//           // Incrementar la cantidad del producto existente
//           existingProduct.quantity += 1;
//         } else {
//           // Agregar un nuevo producto al carrito con cantidad 1
//           cart.productos.push({ productId, quantity: 1 });
//         }

//         // Guardar el carrito actualizado en la base de datos
//         await cart.save();
//         console.log('Producto agregado con éxito');
//       } else {
//         console.log('Carrito no encontrado');
//       }
//     } catch (error) {
//       console.error('Error al agregar producto al carrito:', error);
//       throw error;
//     }
//   }
// }

module.exports = CartManager;
