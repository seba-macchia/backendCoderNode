// models/user.model.js

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
        enum: ['user', 'premium', 'admin'], // Definir los roles permitidos
        default: 'user', // Establecer el rol por defecto
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts",
        required: true,
    },
    githubId: {
        type: String,
        unique: true,
    },
    resetPasswordToken:{
        type: String,
    },
    resetPasswordExpires:{
        type: Date,
    }
});

const User = mongoose.model('User', UserSchema); 

module.exports = User;
