const errorDictionary = require("../middleware/errorDictionary");
const CartManager = require("../services/cartService");
const cartManager = new CartManager();
const Product = require("../models/productManager.model"); 
const TicketService = require("../services/ticketService");
const ticketService = new TicketService();
const { getLogger } = require('../config/logger.config');
const logger = getLogger(process.env.NODE_ENV);


async function getAllCarts(req, res) {
  try {
    logger.debug('Obteniendo todos los carritos...');
    let response = await cartManager.getCarts();
    if (response != false) {
      logger.info('Carritos recuperados exitosamente.');
      return res.status(200).send({ carts: response });
    } else {
      logger.warning('No se encontraron carritos.');
      res.status(404).send({ msg: errorDictionary.CART_NOT_FOUND });
    }
  } catch (err) {
    logger.error('Error al obtener carritos:', err);
    res.status(500).send({ msg: errorDictionary.INTERNAL_SERVER_ERROR });
  }
}

async function addProductToCart(req, res) {
  try {
    let cId = req.params.cId;
    let pId = req.params.pId;
    let quantity = req.body.quantity;

    let product = await Product.findById(pId);

    if (!product) {
      logger.error(`Producto ${pId} no encontrado.`);
      return res.status(404).send({ msg: `Producto ${pId} no encontrado` });
    }

    if (product.stock < quantity) {
      logger.warning(`Stock insuficiente para el producto ${pId}`);
      return res.status(400).send({ msg: `Stock insuficiente para el producto ${pId}` });
    }

    await cartManager.addProdToCart(cId, pId);
    logger.info(`Producto ${pId} agregado al carrito ${cId}`);
    res.status(201).send({ msg: `Producto ${pId} agregado al carrito ${cId}` });
  } catch (error) {
    logger.error('Error al agregar producto al carrito:', error);
    res.status(500).send({ msg: errorDictionary.SERVER_PRODUCT_ERROR });
  }
}

async function updateProductQuantity(req, res) {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;
    const userRole = req.user.role;

    const product = await Product.findById(pid);
    
    if (userRole === 'premium' && product.owner != 'admin') {
      logger.error('No tiene permisos para agregar este producto');
      return res.status(403).send({ msg: 'No tiene permisos para agregar este producto' });
    }

    let response = await cartManager.updateProductQuantity(cid, pid, quantity);

    if (response) {
      logger.info(`Se actualizó la cantidad del producto ${pid} en el carrito ${cid}`);
      res.status(200).send({ msg: `Se actualizó la cantidad del producto ${pid} en el carrito ${cid}`, data: response.data });
    } else {
      logger.warning(`No se pudo actualizar la cantidad del producto ${pid} en el carrito ${cid}`);
      res.status(404).send({ msg: `No se pudo actualizar la cantidad del producto ${pid} en el carrito ${cid}` });
    }
  } catch (error) {
    logger.error('Error al actualizar cantidad del producto en el carrito:', error);
    res.status(500).send({ msg: errorDictionary.SERVER_PRODUCT_ERROR });
  }
}

async function showCart(req, res) {
  try {
    const cid = req.params.cid;

    let response = await cartManager.getCartById(cid);

    if (response.success) {
      // Verificar si la solicitud proviene de Thunder o Swagger
      const userAgent = req.get('User-Agent');
      const isThunder = userAgent.includes('Thunder');
      const isSwagger = userAgent.includes('Swagger');

      if (isThunder || isSwagger) {
        // Si es Thunder o Swagger, devolver el carrito en formato JSON
        res.json(response.products);
      } else {
        // Si es desde un navegador web, renderizar la vista de carrito
        res.render("cart", {
          products: response.products,
          user: req.session.user ? req.session.user : { email: null, role: null },
          cartId: req.session.user.cart,
          valor: true,
        });
      }
    } else {
      logger.warning('No se encontró el carrito solicitado.');
      res.status(404).send({ msg: response.message });
    }
  } catch (err) {
    logger.error('Error al mostrar carrito:', err);
    res.status(500).send({ msg: errorDictionary.INTERNAL_SERVER_ERROR });
  }
}



async function deleteAllProductsFromCart(req, res) {
  try {
    const cid = req.params.cid;

    let response = await cartManager.deleteAllProdFromCart(cid);

    if (response) {
      logger.info(`Todos los productos del carrito ${cid} eliminados correctamente.`);
      res.redirect("/api/carts/" + cid);
    } else {
      logger.warning(`No se pudo eliminar todos los productos del carrito ${cid}`);
      res.status(404).send({ msg: `No se pudo eliminar todos los productos del carrito ${cid}` });
    }
  } catch (err) {
    logger.error('Error al eliminar todos los productos del carrito:', err);
    res.status(500).send({ msg: errorDictionary.SERVER_CART_ERROR });
  }
}

async function createCart(req, res) {
  try {
    let response = await cartManager.createCart();
    if (response) {
      logger.info('Carrito creado exitosamente.');
      res.status(201).send({ msg: errorDictionary.CART_FOUND, cart: response });
    } else {
      logger.warning('Error al crear carrito.');
      res.status(400).send({ msg: errorDictionary.ERROR_CREATING_CART });
    }
  } catch (err) {
    logger.error('Error al crear carrito:', err);
    res.status(500).send({ msg: errorDictionary.SERVER_CREATED_CART_ERROR });
  }
}

async function purchaseCart(req, res) {
  const logger = req.logger || fallbackLogger; // Asegúrate de tener un logger alternativo si req.logger no está definido

  try {
    const { cid } = req.params;
    const userId = req.user._id;

    const cart = await cartManager.getCartById(cid);
    if (!cart.success) {
      logger.warning('El carrito no existe.'); // Usamos logger
      return res.status(404).json({ error: errorDictionary.CART_NOT_FOUND });
    }
    const ticketData = await ticketService.generateTicket(cart, userId);

    if (ticketData.ticket) {
      // Si se pudo generar un ticket
      if (ticketData.purchasedProducts.length === cart.products.length) {
        // Si se vendieron todos los productos
        logger.info('Compra completada.'); // Usamos logger

        // Verificar si la solicitud proviene de Swagger
        const userAgent = req.get('User-Agent');
        const isSwagger = userAgent.includes('Swagger');

        if (isSwagger) {
          // Si es Swagger, devolver solo el ticket en formato JSON
          return res.json({ ticket: ticketData.ticket.toObject(), cartId: cid });
        } else {
          // Si es desde un navegador web, renderizar la vista de checkout
          return res.render('checkout', { ticket: ticketData.ticket.toObject(), cartId: cid });
        }
      } else {
        logger.info('Compra parcial.'); // Usamos logger

        // Si no se vendieron todos los productos
        // Renderizar la vista de checkout con el ticket y los detalles de los productos no comprados
        return res.render('checkout', { ticket: ticketData.ticket.toObject(), unpurchasedProducts: ticketData.unpurchasedProducts, cartId: cid });
      }
    } else {
      // Si no se pudo generar un ticket
      logger.error('No se pudo generar el ticket.'); // Usamos logger

      // Renderizar la vista de checkout con los detalles de los productos no comprados
      return res.render('checkout', { error: errorDictionary.TICKET_NOT_GENERATED, unpurchasedProducts: ticketData.unpurchasedProducts, cartId: cid });
    }
  } catch (error) {
    logger.error('Error al procesar la compra:', error); // Usamos logger
    res.status(500).json({ error: 'Ocurrió un error' });
  }
}


async function deleteCart(req, res) {
  try {
    const cid = req.params.cid;

    const response = await cartManager.deleteCart(cid);
    if (response) {
      logger.info(`Carrito con ID ${cid} eliminado correctamente.`);
      res.status(200).send({ msg: `Carrito con ID ${cid} eliminado correctamente` });
    } else {
      logger.warning(`No se encontró ningún carrito con el ID ${cid}`);
      res.status(404).send({ msg: `No se encontró ningún carrito con el ID ${cid}` });
    }
  } catch (err) {
    logger.error('Error al eliminar carrito:', err);
    res.status(500).send({ msg: errorDictionary.SERVER_ELIMINATE_CART});
  }
}

module.exports = {
  getAllCarts,
  addProductToCart,
  createCart,
  updateProductQuantity,
  purchaseCart,
  deleteAllProductsFromCart,
  deleteCart,
  showCart,
};
