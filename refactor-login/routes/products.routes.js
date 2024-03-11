// import { Router } from "express";

// import { ProductManager } from "../models/productManager.js";

// const productManager = new ProductManager("./products.json");

const express = require('express')

const {Router} = express

const Products = require('../public/dao/db/models/productManager')
const productManager = new Products()

const session = require('express-session');

const route = new Router()


route.get("/", async (req, res) => {
  const limit = parseInt(req.query.limit);
  const page = parseInt(req.query.page);
  const sort = req.query.sort;
  const query = req.query || {};

  let filter = {};

  if (query.category) {
    filter.category = query.category;
  }
  if (query.status) {
    filter.status = query.status;
  }

  // Obtener productos con el método getProducts()
  const productos = await productManager.getProducts(limit, page, sort, filter);

  productos.payload = productos.payload.map((item) => {
    return {
      id: item._id,
      title: item.title,
      description: item.description,
      price: item.price,
      category: item.category,
      stock: item.stock,
      disponibilidad: item.status,
      thumbnail: item.thumbnail,
    };
  });

  if (productos.success && productos.payload.length > 0) {
    // Si la solicitud proviene de Postman o si el cliente ha especificado que prefiere JSON
    if (req.get('Content-Type') === 'application/json' || req.query.format === 'json') {
      res.status(200).json({ products: productos.payload });
    } else {
      // Si la solicitud proviene de un navegador u otro cliente que espera HTML
      res.render("products", {
        products: productos.payload,
        user: session.user = session.user ? session.user : {username: null, rol: null},
        cartId: "65de4f0a47f2cbb0a2bb738c",
        valor: true,
      });
    }
  } else if (productos.payload.length == 0) {
    res
      .status(500)
      .json({
        message: "No hay productos para mostrar",
        data: productos.payload,
        totalPages: productos.totalPages,
      });
  } else {
    // Manejar errores y enviar respuesta de error al cliente
    res
      .status(500)
      .json({ message: productos.message, error: productos.error });
  }
});

// Ruta para obtener un producto por ID

route.get('/prodById/:productId', async (req, res) => {
  const productId = req.params.productId;

  try {
    const result = await productManager.getProductById(productId);

    if (result.success) {
      res.send({
        msg: result.message,
        data: result.data
      });
    } else {
      res.send({
        msg: result.message,
        error: result.error || null
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
      status,
      category
    } = req.body;

    // Crear una instancia del modelo Product con los datos del cuerpo de la solicitud
    const newProduct = await productManager.addProduct({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category
    });


    res.status(200).json(newProduct,);
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
    const updatedProduct = await productManager.updateProduct(productId, newData);
    
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
      error: err.message || 'Error interno del servidor',
    });
  }
});

// Ruta para eliminar un producto por ID

route.delete('/deleteProd/:pid', async (req, res) => {
  const { pid } = req.params;

  try {
    const deleted = await productManager.delProduct(pid);

    if (deleted) {
      res.status(200).send("Producto eliminado exitosamente");
    } else {
      res.status(404).send({ error: `Producto con id: ${pid} no encontrado` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: `Error al eliminar producto con id: ${pid}` });
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


// route.get('/allProducts', async (req, res) => {
//   try {
//     const products = await productManager.findOne();
//     res.send({
//       msg: 'Productos encontrados',
//       data: products
//     });
//   } catch (error) {
//     console.error(`Error al obtener productos: ${error}`);
//     res.status(500).send({
//       error: 'Error al obtener productos'
//     });
//   }
// });

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