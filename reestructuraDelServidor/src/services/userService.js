const User = require("../models/user.model");
const { createHash } = require("../utils/bcrypts");
const CartManager = require("./cartService");
const cartManager = new CartManager();
const mongoose = require('mongoose');

class UserManager {
  constructor() {
    this.users = [];
  }

  async addUser(userData) {
    try {
      const exist = await this.findUserByEmail(userData.email);
      if(!exist) {
        const cart = await cartManager.addCart();
        userData.cart = cart._id
      }else{
        if (!exist.cart) {
          const cart = await cartManager.addCart();
          userData.cart = cart._id
        } else {
          const cart = await cartManager.getCartById(exist.cart._id);
          userData.cart = cart._id
        }
      }

      if (userData.email === "admin@coder.com") {
        userData.role = "admin";
      }

      // Crear una nueva instancia de User
      const newUser = new User(userData);

      // Guardar el nuevo usuario en la base de datos
      await newUser.save();

      return newUser;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }


  async getUserById(id) {
    try {
      if (!id) {
        // Si el ID no está definido, retornar null
        return null;
      }
  
      // Verificar si el ID es válido antes de buscar en la base de datos
      if (!mongoose.Types.ObjectId.isValid(id)) {
        // Si el ID no es válido, retornar null
        return null;
      }
  
      let user = await User.findById(id);
      return user;
    } catch (err) {
      console.error(err);
      return null; // Retornar null en caso de error
    }
  }

  async deleteUser(id) {
    try {
      let res = await User.deleteOne({ _id: id });
      return res;
    } catch (err) {
      console.error(err);
    }
  }

  async loginWithGitHub(profile) {
    try {
      const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '';
      const exist = await this.findUserByEmail(email);
      
      if (!exist) {
        // Si el usuario no existe, crea un nuevo usuario
        const cartData = await cartManager.addCart();
        const cartId = cartData._id;
  
        const newUser = new User({
          email: email,
          password: createHash("githubuserpassword"),
          name: profile.displayName || '',
          lastname: profile.name && profile.name.familyName ? profile.name.familyName : '',
          age: profile.age || '',
          cart: cartId,
          githubId: profile.id,
        });
  
        if (newUser.email === "admin@coder.com") {
          newUser.role = "admin";
        } else {
          newUser.role = "github-user";
        }
  
        await newUser.save();
        delete newUser.password;
        
        return newUser;
      } else {
        // Si el usuario ya existe, devuelve el usuario existente
        delete exist.password;
        return exist;
      }
  
    } catch (err) {
      console.error(err);
      return false;
    }
  }
  

  async findUserByEmail(email) {
    try {
      const userFound = await User.findOne({ email: email });
      return userFound ? userFound : false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  async findUserById(id) {
    try {
      const userFound = await User.findOne({ githubId: id });
      return userFound ? userFound : false;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}

module.exports = UserManager;