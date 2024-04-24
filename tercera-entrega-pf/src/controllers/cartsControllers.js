// cartControllers.js

const CartManager = require("../services/cartService");
const cartManager = new CartManager();
const Product = require("../models/productManager.model"); // Importa el modelo de Product
const TicketService = require("../services/ticketService");

async function getAllCarts(req, res) {
  try {
    let response = await cartManager.getCarts();
    if (response != false) {
      const cartId = response[response.length - 1]._id;
      res.render('productos', {
        user: req.user,
        cartId: cartId,
      });
    } else {
      res.status(404).send({ msg: "Carritos no encontrados" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Error interno del servidor" });
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

    let response = await cartManager.addProdToCart(cId, pId);

    if (response) {
      await TicketService.generateTicket(req.user, cId, pId);
    }

    res.status(201).send({ msg: `Producto ${pId} agregado al carrito ${cId}` });
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Error interno del servidor" });
  }
}

async function updateProductQuantity(req, res) {
  // try {
  //   const cid = req.params.cid;
  //   const pid = req.params.pid;
  //   const quantity = req.body.quantity;

  //   let response = await cartManager.updateProductQuantity(cid, pid, quantity);

  //   if (response) {
  //     res.status(200).send({ msg: `Se actualizó la cantidad del producto ${pid} en el carrito ${cid}`, data: response.data });
  //   } else {
  //     res.status(404).send({ msg: `No se pudo actualizar la cantidad del producto ${pid} en el carrito ${cid}` });
  //   }
  // } catch (error) {
  //   console.error('Error al actualizar la cantidad del producto', error);
  //   res.status(500).send({ msg: 'Error interno del servidor al actualizar la cantidad del producto' });
  // }
}

async function createCart(req, res) {
  try {
    let response = await cartManager.createCart();
    if (response) {
      res.status(201).send({ msg: "Carrito creado exitosamente", cart: response });
    } else {
      res.status(400).send({ msg: "Error al crear el carrito" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "Error interno del servidor al crear el carrito" });
  }
}

async function purchaseCart(req, res) {
  const { cid } = req.params;

  try {
    const cart = await cartManager.getCartById(cid);
    if (!cart.success) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const products = cart.data;
    const unpurchasedProducts = [];

    for (const product of products) {
      const productDocument = await Product.findById(product.product);
      
      if (!productDocument) {
        continue;
      }

      if (productDocument.stock >= product.quantity) {
        productDocument.stock -= product.quantity;
        await productDocument.save();
      } else {
        unpurchasedProducts.push(product.product);
      }
    }

    const ticket = await TicketService.generateTicket(cart, userId);

    if (unpurchasedProducts.length > 0) {
      // Actualizar el carrito para incluir solo los productos que no pudieron comprarse
      const filteredProducts = products.filter(product => unpurchasedProducts.includes(product.product));
      await cartManager.updateCartProducts(cid, filteredProducts);
    } else {
      // Si todos los productos se compraron con éxito, eliminar el carrito
      await cartManager.deleteAllProdFromCart(cid);
    }

    // Renderizar la vista de checkout con la información del ticket
    res.render('checkout', { ticket });

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
      res.status(500).send({ msg: "Error interno del servidor al eliminar el carrito" });
    }
  }


module.exports = {
  getAllCarts,
  addProductToCart,
  createCart,
  updateProductQuantity,
  purchaseCart,
  deleteCart,
};
