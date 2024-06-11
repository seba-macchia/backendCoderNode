const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
    name: String,
    reference: String
});

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
        enum: ['user', 'premium', 'admin'],
        default: 'user',
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
    },
    documents: [DocumentSchema],
    last_connection: {
        type: Date,
    }
});

const User = mongoose.model('User', UserSchema); 

module.exports = User;
