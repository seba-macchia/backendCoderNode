const ProductManager = require("../services/productService");
const productManager = new ProductManager();

async function getAllProducts(req, res) {
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

  try {
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
      // Verificar si el usuario tiene el rol de administrador
      const isAdmin = req.session.user ? req.session.user.role === 'admin' : false;

      // Renderizar la vista de productos con el botón de gestión solo si el usuario es administrador
      res.render("products", {
        products: productos.payload,
        user: req.session.user ? req.session.user : { email: null, role: null },
        cartId: req.session.user.cart,
        valor: true,
        isAdmin: isAdmin // Pasar la variable isAdmin a la vista
      });
    } else if (productos.payload.length == 0) {
      res.status(500).json({
        message: "No hay productos para mostrar",
        data: productos.payload,
        totalPages: productos.totalPages,
      });
    } else {
      // Manejar errores y enviar respuesta de error al cliente
      res.status(500).json({ message: productos.message, error: productos.error });
    }
  } catch (error) {
    console.error(`Error obteniendo los productos: ${error}`);
    res.status(500).send({ error: "Error interno del servidor" });
  }
}

async function renderManagerPage(req, res) {
  try {
    res.render("productsManager", {
      user: req.session.user ? req.session.user : { email: null, role: null },
      cartId: req.session.user.cart,
      valor: true,
    });
  } catch (err) {
    console.error(err);
  }
}

async function getAllProductsAPI(req, res) {
  try {
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

    const productos = await productManager.getProducts(limit, page, sort, filter);

    // Mapear los productos para que coincidan con la estructura esperada
    const mappedProducts = productos.payload.map((item) => ({
      _id: item._id,
      title: item.title,
      description: item.description,
      price: item.price,
      category: item.category,
      stock: item.stock,
      code: item.code,
      status: item.status,
      thumbnail: item.thumbnail,
    }));

    if (productos.success && productos.payload.length > 0) {
      // Verificar si el usuario tiene el rol de administrador
      const isAdmin = req.session.user ? req.session.user.role === 'admin' : false;

      // Renderizar la vista de productos con el botón de gestión solo si el usuario es administrador
      res.json({
        msg: "Productos encontrados",
        data: mappedProducts,
        isAdmin: isAdmin
      });
    } else if (productos.payload.length == 0) {
      res.status(500).json({
        message: "No hay productos para mostrar",
        data: mappedProducts,
        totalPages: productos.totalPages,
      });
    } else {
      // Manejar errores y enviar respuesta de error al cliente
      res.status(500).json({ message: productos.message, error: productos.error });
    }
  } catch (error) {
    console.error(`Error obteniendo los productos: ${error}`);
    res.status(500).send({ error: "Error interno del servidor" });
  }
}


async function getProductById(req, res) {
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
}

async function createProduct(req, res) {
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

    await productManager.addProduct({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
      status,
      category,
    });

    res.redirect("/api/products/manager");
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al agregar producto" });
  }
}

async function updateProduct(req, res) {
  const productId = req.params.id;
  const newData = req.body;

  try {
    const updatedProduct = await productManager.updateProduct(
      productId,
      newData
    )

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
}

async function deleteProduct(req, res) {
  const { pid } = req.params;

  try {
    // Busca y elimina el producto con el ID proporcionado
    const deletedProduct = await productManager.delProduct(pid);

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
}

module.exports = {
  getAllProducts,
  getAllProductsAPI,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  renderManagerPage,
};