const mongoose = require("mongoose");


const CartSchema = new mongoose.Schema({
  products: {
      type: [
          {
              product: {
                  type: mongoose.Schema.Types.ObjectId,
                  ref: "Product"
              },
              quantity: {
                type: Number,
                required: true
            }
          }
      ],
    default: []
  }
})

const Cart = mongoose.model("carts", CartSchema);
module.exports = Cart;