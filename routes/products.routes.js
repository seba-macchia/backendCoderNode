// import { Router } from "express";

// import { ProductManager } from "../models/productManager.js";

// const productManager = new ProductManager("./products.json");

const express = require('express')

const {Router} = express

const Products = require('../public/dao/db/models/productManager.model.js')

const route = new Router()

route.get('/allProducts', async ( req, res) => {
  try{
    let resp = await Products.find()
    res.send({
      msg: 'Productos encontrados',
      data: resp
    })
  }catch(err){
    res.send({
      error: err
    })
  }
})

// Ruta para obtener un producto por ID

route.get('/prodById/:productId', async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await Products.findOne({ _id: productId });

    if (product) {
      res.send({
        msg: 'Producto encontrado',
        data: product
      });
    } else {
      res.send({
        msg: 'Producto no encontrado',
        data: null
      });
    }
  } catch (err) {
    res.send({
      error: err.message
    });
  }
});

// Ruta para crear un producto
route.post("/createProd", async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status = true,
      category
    } = req.body;

    // Crear una instancia del modelo Product con los datos del cuerpo de la solicitud
    const newProduct = new Products({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category
    });

    // Guardar el nuevo producto en la base de datos
    const savedProduct = await newProduct.save();

    res.status(200).json(savedProduct);
  } catch (error) {
    console.log(error);
    res.status(404).send('ERROR AL AGREGAR PRODUCTO');
  }
});

// Ruta para editar un producto por ID
route.put('/updateProd/:id', async (req, res) => {
  const productId = req.params.id;
  const newData = req.body;

  try {
    const updatedProduct = await Products.findByIdAndUpdate(productId, newData, { new: true });

    if (updatedProduct) {
      res.status(200).send({
        msg: 'Producto actualizado con éxito',
        data: updatedProduct,
      });
    } else {
      res.status(404).send({
        error: 'Producto no encontrado',
      });
    }
  } catch (err) {
    res.status(500).send({
      error: err,
    });
  }
});

// Ruta para eliminar un producto por ID

route.delete('/deleteProd/:pid', async (req, res) => {
  const { pid } = req.params;

  try {
    // Busca y elimina el producto con el ID proporcionado
    const deletedProduct = await Products.findOneAndDelete({ _id: pid });

    if (deletedProduct) {
      res.status(200).send("PRODUCTO ELIMINADO");
    } else {
      res.status(404).send({ error: `PRODUCTO NO ENCONTRADO CON ID ${pid}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: `ERROR AL ELIMINAR EL PRODUCTO CON ID ${pid}` });
  }
});


module.exports = route



// CRUD PRODUCTOS



// const routerProd = Router();

// routerProd.get("/", async(req, res) => {
//   try{
//     const { limit } = req.query
//     const products = await productManager.getProducts()
//     if (limit){
//       const limitProducts = products.slice(0, limit)
//       return res.json(limitProducts)
//     }
//     return res.json(products)

//   }catch (error){
//       console.log(error)
//       res.status(404).send('ERROR AL RECIBIR LOS PRODUCTOS')
    
//   }
// })

// routerProd.get("/:pid", async(req, res) => {
//   const { pid } = req.params
//   try{
//     const product = await productManager.getProductsById(pid)
//     if (product){
//       return res.json(product)
//     }
//     return res.send({ error: "Producto no encontrado" })
//   }catch(error){
//     console.log(error)
//     res.status(404).send(`ERROR AL RECIBIR EL PRODUCTO CON ID ${pid}`)
//   }
// })

// routerProd.post("/", async (req, res) => {
//   try {
//     const {
//       title,
//       description,
//       price,
//       thumbnail,
//       code,
//       stock,
//       status = true,
//       category
//     } = req.body;

//     // Enviar un objeto con las propiedades requeridas al método addProduct
//     const respuesta = await productManager.addProduct({
//       title,
//       description,
//       price,
//       thumbnail,
//       code,
//       stock,
//       status,
//       category
//     });

//     res.status(200).json(respuesta);
//   } catch (error) {
//     console.log(error);
//     res.status(404).send('ERROR AL AGREGAR PRODUCTO');
//   }
// });

// routerProd.put("/:pid", async(req, res) => {
//   const { pid } = req.params;
//   try {
//     const { title, description, price, thumbnail, code, stock, status = true, category } = req.body;
//     const respuesta = await productManager.updateProduct(pid, { title, description, price, thumbnail, code, stock, status, category });
//     res.status(200).json(respuesta);
//   } catch (error) {
//     console.log(error);
//     res.status(404).send(`ERROR AL EDITAR EL PRODUCTO CON ID ${pid}`);
//   }
// });

// routerProd.delete("/:pid", async(req, res) => {
//   const { pid } = req.params
//   try{
//       await productManager.deleteProduct(pid)
  
//       res.status(200).send("PRODUCTO ELIMINADO")
//   }catch (error){
//     console.log(error)
//     res.status(404).send({ error: `ERROR AL ELIMINAR EL PRODUCTOCON ID ${pid}` })
//   }
// })


// export { routerProd };