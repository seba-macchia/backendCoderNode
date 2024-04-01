const Products = require('../models/productManager.model');

class ProductManager {
  constructor() {
    this.products = [];
  }

  async getProducts(limit, page, sort, query) {
    try {
      let sortOrder = sort === 'desc' ? -1 : 1;
  
      let filter = {};
      
      if (query.category) {
        filter.category = query.category;
      }
      if (query.status !== undefined) {
        filter.status = query.status;
      }
  
      let productos = await Products.paginate(
        filter,
        {
          limit: limit ? limit : 10,
          sort: sort ? { price: sortOrder } : null,
          page: page ? page : 1,
        }
      );
  
      productos.docs = productos.docs.map(doc => doc.toObject());
  
      const buildQueryString = (params) => {
        return Object.keys(params)
          .map(key => `${key}=${encodeURIComponent(params[key])}`)
          .join('&');
      };
  
      const queryString = buildQueryString(query);
  
      return {
        success: true,
        message: "Productos obtenidos correctamente",
        payload: productos.docs,
        totalPages: productos.totalPages,
        prevPage: productos.prevPage,
        nextPage: productos.nextPage,
        hasPrevPage: productos.hasPrevPage,
        hasNextPage: productos.hasNextPage,
        prevLink: productos.prevPage ? `http://localhost:8080/api/?${queryString}&page=${productos.prevPage}&limit=${limit}&sort=${sort}` : null,
        nextLink: productos.nextPage ? `http://localhost:8080/api/?${queryString}&page=${productos.nextPage}&limit=${limit}&sort=${sort}` : null
      };
    } catch (error) {
      return { success: false, message: 'Error al obtener los productos.', error: error }
    }
  }

  async getProductById(id) {
    try {
      const product = await Products.findOne({ _id: id });

      if (product) {
        return {
          success: true,
          message: 'Producto encontrado',
          data: product
        };
      } else {
        return {
          success: false,
          message: 'Producto no encontrado',
          data: null
        };
      }
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: 'Error al buscar el producto',
        error: err.message
      };
    }
  }
  
  

  async addProduct(newProduct) {
    try {
      this.products = newProduct;
      await Products.create(this.products);
      return newProduct;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async delProduct(id) {
    try {
      const result = await Products.deleteOne({ _id: id });
      return result.deletedCount > 0; // Verifica si se eliminó algún documento
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  async updateProduct(id, update) {
    try {
      const updatedProduct = await Products.findByIdAndUpdate(id, update, { new: true });
      return updatedProduct;
    } catch (err) {
      console.error(err);
      return null;
    }
  }
  
}

module.exports = ProductManager;



// const { v4: uuidv4 } = require('uuid');
// const Product = require('../models/productManager.model');

// class ProductManager {
//   async getProducts() {
//     try {
//       const products = await Product.find();
//       return products;
//     } catch (error) {
//       console.error('Error al obtener productos:', error);
//       throw error;
//     }
//   }

//   async getProductsById(id) {
//     try {
//       const product = await Product.findById(id);
//       if (product) {
//         return product;
//       } else {
//         console.log('Producto no encontrado');
//         return null;
//       }
//     } catch (error) {
//       console.error('Error al obtener producto por ID:', error);
//       throw error;
//     }
//   }

//   async addProduct({ title, description, price, thumbnail, code, stock, status, category }) {
//     try {
//       const newProduct = new Product({
//         id: uuidv4(),
//         title,
//         description,
//         price,
//         thumbnail,
//         code,
//         stock,
//         status,
//         category,
//       });

//       await newProduct.save();
//       return newProduct;
//     } catch (error) {
//       console.error('Error al agregar producto:', error);
//       throw error;
//     }
//   }

//   async updateProduct(id, data) {
//     try {
//       const product = await Product.findByIdAndUpdate(id, data, { new: true });

//       if (product) {
//         return product;
//       } else {
//         console.log('Producto no encontrado');
//         return null;
//       }
//     } catch (error) {
//       console.error('Error al actualizar producto:', error);
//       throw error;
//     }
//   }

//   async deleteProduct(id) {
//     try {
//       const product = await Product.findByIdAndDelete(id);

//       if (!product) {
//         console.log('Producto no encontrado');
//       }
//     } catch (error) {
//       console.error('Error al eliminar producto:', error);
//       throw error;
//     }
//   }
// }

// module.exports = ProductManager;
