const Ticket = require('../models/ticket.model');
const Product = require('../models/productManager.model');

class TicketService {
  async generateTicket(cart, userId) {
    try {
      const products = cart.products;
      const ticket = new Ticket({
        code: this.generateCode(),
        purchase_datetime: new Date(),
        amount: cart.total,
        purchaser: userId
      });

      // Procesar compra para cada producto en el carrito
      for (const product of products) {
        const productDocument = await Product.findById(product.product);
        if (!productDocument) {
          continue; // Si el producto no existe, saltar al siguiente
        }
        if (productDocument.stock >= product.quantity) {
          productDocument.stock -= product.quantity;
          await productDocument.save();
        } else {
          throw new Error(`Insufficient stock for product: ${productDocument.title}`);
        }
      }

      // Guardar el ticket
      await ticket.save();

      return ticket;
    } catch (error) {
      throw new Error(`Error generating ticket: ${error.message}`);
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
