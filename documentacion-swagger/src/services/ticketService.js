// ticketService.js

const Ticket = require('../models/ticket.model');
const Product = require('../models/productManager.model');
const User = require('../models/user.model');
const CartService = require('./cartService'); // Importamos el servicio de carrito
const errorDictionary = require('../middleware/errorDictionary');

class TicketService {
  constructor() {
    this.cartService = new CartService(); // Creamos una instancia del servicio de carrito
  }

  async generateTicket(cart, userId) {
    try {
      const products = cart.products;
      
      const purchasedProducts = []; // Arreglo para almacenar los IDs de productos comprados
      const unpurchasedProducts = []; // Arreglo para almacenar los IDs de productos no comprados
      let ticket = null;
  
      // Sumar el atributo priceTot de todos los productos
      const totalAmount = products.reduce((total, product) => total + (product.price * product.quantity), 0);
  
      const user = await User.findById(userId);
      if (!user) {
        throw new Error(errorDictionary.USER_NOT_FOUND_ID`: ${userId}`);
      }
  
      // Procesar compra para cada producto en el carrito y reducir el stock
      for (const product of products) {
        const productDocument = await Product.findOne({ _id: product._id });
        
        if (!productDocument) {
          continue; // Si el producto no existe, saltar al siguiente
        }

        if (productDocument.stock >= product.quantity) {
          productDocument.stock -= product.quantity;
          await productDocument.save();
          purchasedProducts.push({
            _id: product._id,
            title: product.title,
            quantity: product.quantity,
            category: product.category,
            price: product.price
          }); // Agregar el producto comprado al arreglo

          // Eliminar el producto vendido del carrito utilizando el servicio de carrito
          await this.cartService.delProdById(cart._id, product._id);
        } else {
          unpurchasedProducts.push({
            _id: product._id,
            title: product.title,
            quantity: product.quantity,
            category: product.category,
            price: product.price
          }); // Agregar el producto no comprado al arreglo
        }
      }
  
      // Si se compró al menos un producto, generamos el ticket
      if (purchasedProducts.length > 0) {
        ticket = new Ticket({
          code: this.generateCode(),
          purchase_datetime: new Date(),
          amount: totalAmount,
          purchaser: user.email
        });
        await ticket.save();
      }
  
      return { ticket, purchasedProducts, unpurchasedProducts };
    } catch (error) {
      throw new Error(errorDictionary.TICKET_NOT_GENERATED`: ${error.message}`);
    }
  }
  

  generateCode() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}

module.exports = TicketService;