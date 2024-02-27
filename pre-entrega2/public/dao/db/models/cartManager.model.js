const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products"
        },
        quantity: {
          type: Number,
          default: 0
        }
      }
    ],
    default: []
  }
});


const Cart = mongoose.model("carts", CartSchema);
module.exports = Cart;

