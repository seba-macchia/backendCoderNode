const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  user: {
    type: String,
    require: true
  },
  message:{
    type: String,
    require: true,
  },
});

const Message = mongoose.model('message', chatSchema);

module.exports = Message;
