const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
  },
  name: {
    type: String,
  },
  lastname: {
    type: String,
  },
  age: {
    type: String,
  },
  role: {
    type: String,
    default: "user",
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "carts",
    required: true,
  },
  githubId: {
    type: String,
    unique: true,
  }
});

const User = mongoose.model('User', UserSchema); 

module.exports = User;