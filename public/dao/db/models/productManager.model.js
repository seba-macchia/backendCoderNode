const mongoose = require('mongoose')

// Definición del esquema del producto
const productSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
  },
  description: {
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  thumbnail: { 
    type: String, 
  },
  code: { 
    type: String, 
    required: true 
  },
  stock: { 
    type: Number, 
    required: true
  },
  status: { 
    type: String
  },
  category: { 
    type: String, 
    required: true 
  },
});

// Creación del modelo Product basado en el esquema
const Product = mongoose.model('Product', productSchema);

// Exportación del modelo para su uso en otras partes de la aplicación
module.exports = Product;
