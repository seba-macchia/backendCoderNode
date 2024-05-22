const Products = require('../models/productManager.model');
const { v4: uuidv4 } = require('uuid');
const errorDictionary = require('../middleware/errorDictionary');
const { json } = require('express');

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
        message: errorDictionary.PRODUCTS_OBTAINED_FOUND,
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
      return { success: false, message: errorDictionary.PRODUCTS_OBTAINED_NOT_FOUND, error: error }
    }
  }

  async getProductById(id) {
    try {
      const product = await Products.findOne({ _id: id });

      if (product) {
        return {
          success: true,
          message: errorDictionary.PRODUCT_FOUND,
          data: product
        };
      } else {
        return {
          success: false,
          message: errorDictionary.PRODUCT_NOT_FOUND,
          data: null
        };
      }
    } catch (err) {
      console.error(err);
      return {
        success: false,
        message: errorDictionary.ERROR_SEARCHED_PRODUCT,
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
  
  async createProduct(req, res) {
    try {
      const newProduct = new Products(req.body);
      await newProduct.save();
      res.status(201).json({ product: newProduct });
    } catch (error) {
      res.status(500).json({ error: errorDictionary.GENERIC_ERROR });
    }
  }

  async getProduct(req, res) {
    const { id } = req.params;
    try {
      const product = await Products.findById(id);
      if (!product) {
        return res.status(400).json({ error: errorDictionary.PRODUCT_NOT_EXISTS });
      }
      res.status(200).json({ product });
    } catch (error) {
      res.status(500).json({ error: errorDictionary.GENERIC_ERROR });
    }
  }

  async updateProductInfo(req, res) {
    const { id } = req.params;
    const update = req.body;
    try {
      const updatedProduct = await Products.findByIdAndUpdate(id, update, { new: true });
      if (!updatedProduct) {
        return res.status(400).json({ error: errorDictionary.PRODUCT_NOT_EXISTS });
      }
      res.status(200).json({ updatedProduct });
    } catch (error) {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }

  async deleteProduct(req, res) {
    const { id } = req.params;
    try {
      const result = await Products.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        return res.status(400).json({ error: errorDictionary.PRODUCT_NOT_EXISTS });
      }
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: errorDictionary.GENERIC_ERROR });
    }
  }

  async updateProductById(id, update) {
    try {
      const updatedProduct = await Products.findByIdAndUpdate(id, update, { new: true });
      if (!updatedProduct) {
        return { success: false, message: errorDictionary.PRODUCT_NOT_EXISTS };
      }
      return { success: true, updatedProduct };
    } catch (error) {
      return { success: false, error: 'Something went wrong' };
    }
  }

  async deleteProductById(id) {
    try{
      const result = await Products.deleteOne({ _id: id });
      return { success: true, deletedCount: result.deletedCount };
    }
    catch(error){
      return { success: false, error: 'Something went wrong' };
    }
  }
}

module.exports = ProductManager;