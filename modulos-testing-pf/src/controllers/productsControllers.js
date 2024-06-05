const errorDictionary = require("../middleware/errorDictionary");
const ProductManager = require("../services/productService");
const productManager = new ProductManager();
const faker = require('faker');
const { getLogger } = require('../config/logger.config');
const logger = getLogger(process.env.NODE_ENV);
const ObjectId = require('mongoose').Types.ObjectId; // Importar ObjectId de Mongoose

async function getAllProducts(req, res) {
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
        owner: item.owner
      };
    });

    // Verificar si la solicitud proviene de Thunder
    const userAgent = req.get('User-Agent');
    const isThunder = userAgent.includes('Thunder');

    if (isThunder) {
      // Si es Thunder, devolver los productos en formato JSON
      res.json(productos.payload);
    } else {
      if (productos.success && productos.payload.length > 0) {
        // Verificar si el usuario tiene el rol de administrador
        const isAdmin = req.session.user ? req.session.user.role === 'admin' : false;
        // Verificar si el usuario tiene el rol de premium
        const isPremium = req.session.user ? req.session.user.role === 'premium' : false;

        // Renderizar la vista de productos con el botón de gestión solo si el usuario es administrador
        res.render("products", {
          products: productos.payload,
          user: req.session.user ? req.session.user : { email: null, role: null },
          cartId: req.session.user ? req.session.user.cart : null,
          valor: true,
          isAdmin: isAdmin, // Pasar la variable isAdmin a la vista
          isPremium: isPremium // Pasar la variable isPremium a la vista
        });
      } else if (productos.payload.length == 0) {
        res.status(500).json({
          message: errorDictionary.PRODUCT_NOT_SHOWED,
          data: productos.payload,
          totalPages: productos.totalPages,
        });
      } else {
        // Manejar errores y enviar respuesta de error al cliente
        res.status(500).json({ message: productos.message, error: productos.error });
      }
    }
  } catch (error) {
    logger.error(`Error obteniendo los productos: ${error}`);
    res.status(500).send({ error: errorDictionary.INTERNAL_SERVER_ERROR });
  }
}


async function renderManagerPage(req, res) {
  try {
    res.render("productsManager", {
      user: req.session.user ? req.session.user : { email: null, role: null },
      cartId: req.session.user.cart,
      valor: true,
    });
  } catch (error) {
    logger.error(`Error al renderizar la página del administrador: ${error}`);
    res.status(500).send({ error: errorDictionary.INTERNAL_SERVER_ERROR });
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
      owner: item.owner
    }));

    if (productos.success && productos.payload.length > 0) {
      // Verificar si el usuario tiene el rol de administrador
      const isAdmin = req.session.user ? req.session.user.role === 'admin' : false;
      // Verificar si el usuario tiene el rol de premium
      const isPremium = req.session.user ? req.session.user.role === 'premium' : false;

      // Renderizar la vista de productos con el botón de gestión solo si el usuario es administrador
      res.json({
        msg: errorDictionary.PRODUCT_FOUND,
        data: mappedProducts,
        isAdmin: isAdmin,
        isPremium: isPremium // Pasar la variable isPremium a la vista
      });
    } else if (productos.payload.length == 0) {
      res.status(500).json({
        message: errorDictionary.PRODUCT_NOT_SHOWED,
        data: mappedProducts,
        totalPages: productos.totalPages,
      });
    } else {
      // Manejar errores y enviar respuesta de error al cliente
      res.status(500).json({ message: productos.message, error: productos.error });
    }
  } catch (error) {
    logger.error(`Error obteniendo los productos: ${error}`);
    res.status(500).send({ error: errorDictionary.INTERNAL_SERVER_ERROR });
  }
}


async function getProductById(req, res) {
  const productId = req.params.productId;

  try {
    const productResult = await productManager.getProductById(productId);

    if (productResult.success) {
      res.status(200).send({
        msg: errorDictionary.PRODUCT_FOUND,
        data: productResult.data,
      });
    } else {
      res.status(404).send({
        msg: errorDictionary.PRODUCT_NOT_FOUND,
        data: null,
      });
    }
  } catch (error) {
    logger.error(`Error al obtener el producto por ID: ${error}`);
    res.status(500).send({
      error: errorDictionary.ERROR_SEARCHED_PRODUCT,
    });
  }
}


async function createProduct(req, res, isTest = false) {
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
      owner // Aquí puedes recibir el owner directamente del cuerpo de la solicitud
    } = req.body;

    // Si no se especifica un owner en la solicitud, establecerlo como "admin" por defecto
    const ownerId = owner ? new ObjectId(owner) : "admin";

    // Verificar si el usuario es "premium" o "admin" antes de crear el producto
    if (req.session.user && req.session.user.role === 'premium' || req.session.user.role === 'admin') {
      const newProduct = await productManager.addProduct({
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        status,
        category,
        owner: ownerId, // Asignar el owner calculado al producto
      });

      const userAgent = req.get('User-Agent') || '';
      const isThunder = userAgent.includes('Thunder');

      if (isThunder || isTest) {
        res.status(201).json({
          msg: 'Producto creado correctamente',
          data: newProduct
        });
      } else {
        res.redirect("/api/products/manager");
      }
    } else {
      res.status(403).json({ error: 'Acceso denegado. Solo los usuarios premium o admin pueden crear productos.' });
    }
  } catch (error) {
    logger.error(`Error al crear un producto: ${error}`);
    res.status(500).json({ error: errorDictionary.ERROR_ADDING_PRODUCT });
  }
}




async function updateProduct(req, res) {
  const productId = req.params.id;
  const newData = req.body;
  const user = req.session.user;
  const userId = new ObjectId(user._id);

  try {
    // Verificar si productId es un valor válido
    if (!productId) {
      return res.status(400).send({ error: 'ID del producto no válido' });
    }


    // Buscar el producto
    const productResult = await productManager.getProductById(productId);
    const product = productResult.data;

    // Verificar si se encontró el producto
    if (!product) {
      return res.status(404).send({ error: 'Producto no encontrado' });
    }

    // Verificar los permisos de modificación
    if (user && (user.role === 'admin') || (user.role === 'premium' && product.owner != 'admin' && product.owner.equals(userId))) {
      // Si el usuario tiene permisos, actualizar el producto
      const updatedProduct = await productManager.updateProductById(productId, newData);

      if (updatedProduct) {
        return res.status(200).send({
          msg: 'Producto actualizado correctamente',
          data: updatedProduct,
        });
      } else {
        return res.status(404).send({ error: 'Producto no encontrado' });
      }
    } else {
      // Si el usuario no tiene permisos, mostrar un SweetAlert indicando el error
      return res.status(403).send({ error: 'El usuario no tiene permisos para modificar este producto' });
    }
  } catch (error) {
    // Manejar errores
    console.error(`Error al actualizar el producto: ${error}`);
    return res.status(500).send({ error: 'Error interno del servidor' });
  }
}



async function deleteProduct(req, res) {
  const productId = req.params.id;
  const user = req.session.user;
  const userId = new ObjectId(user._id);

  try {
    // Buscar el producto
    const productResult = await productManager.getProductById(productId);
    const product = productResult.data;

    if (!product) {
      return res.status(404).send({ error: errorDictionary.PRODUCT_NOT_FOUND });
    }

    // Verificar los permisos de eliminación
    if (user && (user.role === 'admin') || (user.role === 'premium' && product.owner != 'admin' && product.owner.equals(userId))) {
      // Si el usuario tiene permisos, eliminar el producto
      const deleted = await productManager.deleteProductById(productId);

      if (deleted) {
        return res.status(200).send({ msg: errorDictionary.PRODUCT_DELETED });
      } else {
        return res.status(404).send({ error: errorDictionary.PRODUCT_NOT_FOUND });
      }
    } else {
      // Si el usuario no tiene permisos, mostrar un SweetAlert indicando el error
      return res.status(403).send({ error: 'El usuario no tiene permisos para eliminar este producto' });

    }
  } catch (error) {
    logger.error(`Error al eliminar el producto: ${error}`);
    return res.status(500).send({ error: errorDictionary.INTERNAL_SERVER_ERROR });
  }
}

// generador de productos simulados
const generateSimulatedProducts = (req, res) => {
  try {
    const simulatedProducts = Array.from({ length: 100 }, (_, index) => ({
      _id: index + 1, // Simula el ID de MongoDB
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: faker.datatype.number({ min: 1, max: 100 }), // Precio aleatorio
      thumbnail: faker.image.imageUrl(200, 300),
      code: faker.lorem.word() + `_${index + 1}`,
      stock: faker.datatype.number({ min: 1, max: 100 }), // Stock aleatorio entre 1 y 100
      status: faker.datatype.boolean(), // Status aleatorio entre true y false
      category: faker.commerce.department(),
    }));

    res.json(simulatedProducts);
  } catch (error) {
    logger.error(`Error al generar productos simulados: ${error}`);
    res.status(500).send({ error: errorDictionary.INTERNAL_SERVER_ERROR });
  }
};

module.exports = {
  getAllProducts,
  getAllProductsAPI,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  renderManagerPage,
  generateSimulatedProducts
};
