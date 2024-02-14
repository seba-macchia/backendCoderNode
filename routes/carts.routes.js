const { Router } = require("express");

const Cart = require('../models/cartManager.model.js')

const route = new Router()

const cartManager = new Cart();

route.get('/allCarts', async (req, res) => {
  try{
    await cartManager.find()
    res.send({
      msg: 'Carritos encontrados',
      data: req.body
    })
  }catch(err){
    console.log(err)
  }
})

route.post('/createCart', async (req, res) =>{
  try{
    await cartManager.create(req.body)
    res.send({
      msg: 'Carrito creado',
      data: req.body
    })
  }catch(err){
    console.log(err)
  }
})


// const cartManager = new CartManager("./cart.json");

// const routerCart = Router()

// // creo un nuevo carrito
// routerCart.post("/", async(req, res) => {
//   try{
//     const newCart = await cartManager.addCart();
//     res.status(200).json(newCart);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send("Error al crear un nuevo carrito");
//   }
// });

// routerCart.get("/:cid", async(req, res) => {
//   const { cid } = req.params
//   try{
//     const cartRecibidos = await cartManager.getCartsProducts(cid)
//     res.json(cartRecibidos)
//   }catch (error){
//     console.log(error)
//     res.status(404).send('ERROR AL CONSULTAR LOS PRODUCTOS DEL CARRITO')
//   }
// })

// agrego un producto al carrito
// routerCart.post("/:cid/products/:pid", async(req, res) => {
//   const { cid, pid } = req.params
//   try{
//     const cart = await cartManager.addProductToCart(cid, pid)
//     res.json(cart)
//   }catch (error){
//     console.log(error)
//     res.status(404).send('ERROR AL AGREGAR EL PRODUCTO AL CARRITO')
//   }
// })

// export {routerCart}


