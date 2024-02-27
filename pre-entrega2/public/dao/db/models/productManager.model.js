const mongoose = require('mongoose')

const mongoosePaginate = require('mongoose-paginate-v2')

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
    type: Boolean,
    default: true,
  },
  category: { 
    type: String, 
    required: true 
  },
});

productSchema.plugin(mongoosePaginate)

// Creación del modelo Product basado en el esquema
const Product = mongoose.model('products', productSchema);

// Exportación del modelo para su uso en otras partes de la aplicación
module.exports =Product;