// cartControllers.js
const errorDictionary = require("../middleware/errorDictionary");
const CartManager = require("../services/cartService");
const cartManager = new CartManager();
const Product = require("../models/productManager.model"); // Importa el modelo de Product
const TicketService = require("../services/ticketService");
const ticketService = new TicketService();

async function getAllCarts(req, res) {
  try {
    let response = await cartManager.getCarts();
    if (response != false) {
      return res.status(200).send({ carts: response });
    } else {
      res.status(404).send({ msg: errorDictionary.CART_NOT_FOUND });
    }
  } catch (err) {
    console.error(err);
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
      return res.status(404).send({ msg: `Producto ${pId} no encontrado` });
    }

    if (product.stock < quantity) {
      return res.status(400).send({ msg: `No hay suficiente stock disponible para el producto ${pId}` });
    }

    await cartManager.addProdToCart(cId, pId);

    res.status(201).send({ msg: `Producto ${pId} agregado al carrito ${cId}` });
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: errorDictionary.INTERNAL_SERVER_ERROR });
  }
}

async function updateProductQuantity(req, res) {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity;

    let response = await cartManager.updateProductQuantity(cid, pid, quantity);

    if (response) {
      res.status(200).send({ msg: `Se actualizó la cantidad del producto ${pid} en el carrito ${cid}`, data: response.data });
    } else {
      res.status(404).send({ msg: `No se pudo actualizar la cantidad del producto ${pid} en el carrito ${cid}` });
    }
  } catch (error) {
    console.error(errorDictionary.SERVER_PRODUCT_ERROR, error);
    res.status(500).send({ msg: errorDictionary.SERVER_PRODUCT_ERROR });
  }
}

async function showCart(req, res) {
  try {
    const cid = req.params.cid;

    let response = await cartManager.getCartById(cid);

    if (response) {
      res.render("cart", {
        products: response.products,
        user: req.session.user ? req.session.user : { email: null, role: null },
        cartId: req.session.user.cart,
        valor: true,
      })
    }
  } catch (err) {
    console.error(err);
  }
}

async function deleteAllProductsFromCart(req, res) {
  try {
    const cid = req.params.cid;

    let response = await cartManager.deleteAllProdFromCart(cid);

    if (response) {
      res.redirect("/api/carts/" + cid);
    } else {
      res.status(404).send({ msg: `No se pudo eliminar todos los productos del carrito ${cid}` });
    }
    }
  catch (err) {
    console.error(err);
    res.status(500).send({ msg: errorDictionary.SERVER_CART_ERROR });
  }
}

async function createCart(req, res) {
  try {
    let response = await cartManager.createCart();
    if (response) {
      res.status(201).send({ msg: errorDictionary.CART_FOUND, cart: response });
    } else {
      res.status(400).send({ msg: errorDictionary.ERROR_CREATING_CART });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: errorDictionary.SERVER_CREATED_CART_ERROR });
  }
}

async function purchaseCart(req, res) {
  const { cid } = req.params;
  const userId = req.user._id;

  try {
    const cart = await cartManager.getCartById(cid);
    if (!cart.success) {
      return res.status(404).json({ error: errorDictionary.CART_NOT_FOUND });
    }

    const ticketData = await ticketService.generateTicket(cart, userId);

    if (ticketData.ticket) {
      // Si se pudo generar un ticket
      if (ticketData.purchasedProducts.length === cart.products.length) {
        // Si se vendieron todos los productos, mostrar solo el ticket
        res.render('checkout', { ticket: ticketData.ticket.toObject(), cartId: cid });
        
      } else {
        console.log(ticketData.ticket);
        // Si no se vendieron todos los productos, mostrar el ticket y los detalles de los productos no comprados
        res.render('checkout', { ticket: ticketData.ticket.toObject(), unpurchasedProducts: ticketData.unpurchasedProducts, cartId: cid });
      }
    } else {
      // Si no se pudo generar un ticket, mostrar los detalles de los productos no comprados
      res.render('checkout', { error: errorDictionary.TICKET_NOT_GENERATED, unpurchasedProducts: ticketData.unpurchasedProducts, cartId: cid });
    }

  } catch (error) {
    console.error("Error al procesar la compra:", error);
    res.status(500).json({ error: 'Something went wrong' });
  }
}


  async function deleteCart(req, res) {
    try {
      const cid = req.params.cid;
  
      const response = await cartManager.deleteCart(cid);
      if (response) {
        res.status(200).send({ msg: `Carrito con ID ${cid} eliminado correctamente` });
      } else {
        res.status(404).send({ msg: `No se encontró ningún carrito con el ID ${cid}` });
      }
    } catch (err) {
      console.error(err);
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