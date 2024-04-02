const CartManager = require("../services/cartService");
const cartManager = new CartManager();

async function getAllCarts(req, res) {
  try {
    let response = await cartManager.getCarts();
    if (response != false) {
      // Obtener el cartId del último carrito creado
      const cartId = response[response.length - 1]._id;
      res.render('productos', {
        user: req.user,
        cartId: cartId, // Pasar el cartId a la plantilla
        products: products // Asegúrate de pasar los productos también
      });
    } else {
      res.status(404).send({
        msg: "Carritos no encontrados",
      });
    }
  } catch (err) {
    console.error(err);
  }
}


async function getCartById(req, res) {
  try {
    let id = req.params.cid
    let carrito = await cartManager.getCartById(id)

    if (carrito.success) {
        res.render('cart', {
            array: carrito.data,
            valor: true
        })
    } else {
        res.status(404).json({ message: carrito.message, error: carrito.error })
    }
  } catch (error) {
    console.error(error);
  }
}

async function addProdToCart(req, res) {
  try {
    let cId = req.params.cId;
    let pId = req.params.pId;
    let response = await cartManager.addProdToCart(cId, pId);
    if (response) {
      res.status(201).send({
        msg: `Producto ${pId} agregado al carrito ${cId}`,
      });
    } else {
      res.status(404).send({
        msg: `Carrito ${cId} no encontrado`,
      });
    }
  } catch (err) {
    console.error(err);
  }
}

async function createCart(req, res) {
  try {
    let response = await cartManager.addCart(req.body);
    if (response) {
      res.status(201).send({
        msg: "Carrito creado exitosamente",
        cart: response // Agrega el objeto del carrito a la respuesta
      });
    } else {
      res.status(400).send({
        msg: "Error al crear el carrito",
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send({
      msg: "Error interno del servidor al crear el carrito"
    });
  }
}

async function deleteProductFromCart(req, res) {
  try {
    let cid = req.params.cid;
    let pid = req.params.pid;
    let response = await cartManager.delProdById(cid, pid);
    if (response) {
      res.status(201).send({
        msg: `Producto ${pid} eliminado con éxito`,
      });
    } else {
      res.status(404).send({
        msg: `Producto ${pid} no existe`,
      });
    }
  } catch (err) {
    console.error(err);
  }
}

async function deleteCart(req, res) {
  try {
    let cid = req.params.cid;
    let response = await cartManager.deleteAllProdFromCart(cid);
    if (response) {
      res.status(200).send({
        msg: `Productos eliminados con éxito`,
      });
    } else {
      res.status(404).send({
        msg: `Carrito ${cid} no encontrado`,
      });
    }
  } catch (err) {
    console.error(err);
  }
}

async function updateCart(req, res) {
  try {
    let cid = req.params.cid;
    let products = req.body.products;
    let response = await cartManager.updateCartProducts(cid, products);
    if (response) {
      res.status(201).json({ message: response.message, data: response.data })
    } else {
      res.status(404).json({ message: response.message, response: updateCart.error })
    }
  } catch (err) {
    console.error(err);
  }
}

async function updateProductQuantity(req, res) {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity; 

    let response = await cartManager.updateProductQuantity(cid, pid, quantity);

    if (response) {
      res.status(200).send({
        msg: `Se actualizó la cantidad del producto ${pid} en el carrito ${cid}`,
        data: response.data,
      });
    } else {
      res.status(404).send({
        msg: `No se pudo actualizar la cantidad del producto ${pid} en el carrito ${cid}`,
      });
    }
  } catch (error) {
    console.log('Error al actualizar la cantidad del producto', error);
    res.status(500).send({
      msg: 'Error interno del servidor al actualizar la cantidad del producto',
    });
  }
}

module.exports = {
  getAllCarts,
  getCartById,
  addProdToCart,
  createCart,
  deleteProductFromCart,
  deleteCart,
  updateCart,
  updateProductQuantity,
};
