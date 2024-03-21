const express = require("express");
const { Router } = express;

const ProductManager = require("../db/productManager");

const productManager = new ProductManager();

const route = new Router();

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
        user: req.session.user = req.session.user ? req.session.user : {username: null, rol: null},
        cartId: "65de373847797cafd7026132",
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

route.get("/allProducts", async (req, res) => {
  try {
    let resp = await ProductManager.find();
    res.send({
      msg: "Productos encontrados",
      data: resp,
    });
  } catch (err) {
    res.send({
      error: err,
    });
  }
});

// Ruta para obtener un producto por ID

route.get("/prodById/:productId", async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await productManager.findOne({ _id: productId });

    if (product) {
      res.send({
        msg: "Producto encontrado",
        data: product,
      });
    } else {
      res.send({
        msg: "Producto no encontrado",
        data: null,
      });
    }
  } catch (err) {
    res.send({
      error: err.message,
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
      category,
    } = req.body;

    const savedProduct = await productManager.addProduct({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
    });

    res.status(200).json(savedProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar producto" });
  }
});

// Ruta para editar un producto por ID
route.put("/updateProd/:id", async (req, res) => {
  const productId = req.params.id;
  const newData = req.body;

  try {
    const updatedProduct = await productManager.findByIdAndUpdate(
      productId,
      newData,
      { new: true }
    );

    if (updatedProduct) {
      res.status(200).send({
        msg: "Producto actualizado con éxito",
        data: updatedProduct,
      });
    } else {
      res.status(404).send({
        error: "Producto no encontrado",
      });
    }
  } catch (err) {
    res.status(500).send({
      error: err,
    });
  }
});

// Ruta para eliminar un producto por ID

route.delete("/deleteProd/:pid", async (req, res) => {
  const { pid } = req.params;

  try {
    // Busca y elimina el producto con el ID proporcionado
    const deletedProduct = await productManager.findOneAndDelete({ _id: pid });

    if (deletedProduct) {
      res.status(200).send("PRODUCTO ELIMINADO");
    } else {
      res.status(404).send({ error: `PRODUCTO NO ENCONTRADO CON ID ${pid}` });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ error: `ERROR AL ELIMINAR EL PRODUCTO CON ID ${pid}` });
  }
});

module.exports = route;