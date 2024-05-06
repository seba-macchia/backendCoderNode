const mongoose = require("mongoose");

const TicketSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  purchase_datetime: {
    type: Date,
    required: true,
    default: Date.now
  },
  amount: {
    type: Number,
    required: true
  },
  purchaser: {
    type: String,
    required: true
  }
});

const Ticket = mongoose.model("Ticket", TicketSchema);
module.exports = Ticket;