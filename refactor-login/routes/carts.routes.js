const { Router } = require("express");
const route = new Router();
const CartManager = require('../public/dao/db/models/cartManager');

const cartManager = new CartManager(); 


// ruta para consultar todos los carritos
route.get('/allCarts', async (req, res) => {
  try {
    let response = await cartManager.getCarts();
    if (response) {
      res.status(200).send({
        msg: 'Carritos encontrados',
        data: response,
      });
    } else{
      res.status(404).send({
        msg: 'Carritos no encontrados',
      });
    }
  } catch (error) {
    console.log('Error al obtener carritos', error);
  }
});

// ruta para buscar un carrito
route.get('/:cid', async (req, res) => {
  let id = req.params.cid
  let carrito = await cartManager.getCartById(id)

  if (carrito.success) {
      res.render('cart', {
          array: carrito.data,
          valor: true
      })
  } else {
      res.status(404).json({ message: carrito.message, error: carrito.error})
  }
})
// ruta para agregar un producto al carrito
route.post('/addProductToCart/:cid/:pid', async (req, res) => {
  try {
    let cid = req.params.cid;
    let pid = req.params.pid;
    let response = await cartManager.addProductToCart(cid, pid);
    if (response) {
      res.status(200).send({
        msg: `Se agrego el producto ${pid} al carrito ${cid}`,
        data: response,
      });
    } else{
      res.status(404).send({
        msg: `no se encontro el carrito ${cid}`,
      });
    }
  } catch (error){
    console.log('Error al agregar producto',error);
  }
});


// ruta para crear un carrito
route.post('/createCart', async (req, res) => {
  try {
    let response = await cartManager.addCart(req.body);
    if (response) {
      res.status(200).send({
        msg: 'Carrito creado',
      });
    } else{
      res.status(404).send({
        msg: 'No se pudo crear el carrito',
      });
    }
  }catch (eror) {
    console.log('Error al crear carrito', eror);
  }
});

// ruta para eliminar todos los productos del carrito
route.delete('/:cid', async (req, res) => {
  try {
    let cid = req.params.cid;
    let response = await cartManager.deleteAllProdFromCart(cid);

    if (response) {
      res.status(200).send({
        msg: `Todos los productos del carrito ${cid} eliminados`,
      });
    } else {
      res.status(404).send({
        msg: `Carrito ${cid} no encontrado o sin productos`,
      });
    }
  } catch (error) {
    console.error('Error al borrar todos los productos del carrito:', error);
    res.status(500).send({
      msg: 'Error interno del servidor al borrar todos los productos del carrito',
    });
  }
});


// ruta para eliminar un producto del carrito
route.delete("/:cid/products/:pid", async (req, res) => {
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
});

//  actualiza solo la cantidad de productos
route.put('/:cid/products/:pid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const pid = req.params.pid;
    const quantity = req.body.quantity; // Asumiendo que la cantidad se encuentra en req.body.quantity

    let response = await cartManager.updateProductQuantity(cid, pid, quantity);

    if (response) {
      res.status(200).send({
        msg:` Se actualizó la cantidad del producto ${pid} en el carrito ${cid}`,
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
});

route.put('/:cid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const products = req.body.products; 
    const cart = await cartManager.updateCartProducts(cid, products);
    if (cart) {
      res.status(200).send({ msg: `Se actualizó el carrito ${cid}`, cart });
    } else {
      res.status(404).send({ msg: `No se encontró el carrito con ID ${cid}` });
    }
  } catch (error) {
    console.log('Error al actualizar carrito con productos:', error);
    res.status(500).send({ msg: 'Error interno del servidor' });
  }
});





// ENTREGA ANTERIOR
// route.get('/allCarts', async (req, res) => {
//   try {
//     const carts = await cartManager.getCarts();
//     res.send({
//       msg: 'Carritos encontrados',
//       data: carts,
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).send('Error al obtener carritos');
//   }
// });

// route.post('/createCart', async (req, res) => {
//   try {
//     const newCart = await cartManager.addCart();
//     res.send({
//       msg: 'Carrito creado',
//       data: newCart,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error al crear carrito');
//   }
// });

// route.post('/addProductToCart/:cartId/:productId', async (req, res) => {
//   try {
//     const { cartId, productId } = req.params;
    
//     await cartManager.addProductToCart(cartId, productId);

//     res.send({
//       msg: 'Producto agregado al carrito con éxito',
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Error al agregar producto al carrito');
//   }
// });

module.exports = route;
