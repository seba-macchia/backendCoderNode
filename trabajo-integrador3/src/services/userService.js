const User = require("../models/user.model");
const { createHash } = require("../utils/bcrypts");
const CartManager = require("./cartService");
const cartManager = new CartManager();
const UserDao = require("../dao/mongo/userDao");
const errorDictionary = require("../middleware/errorDictionary");

class UserManager {
  constructor() {
    this.userDao = new UserDao();
  }

  async addUser(userData) {
    try {
      const exist = await this.findUserByEmail(userData.email);
      let cartId;
  
      if (!exist || !exist.cart) {
        // Si el usuario no existe o no tiene un carrito asociado, crea uno nuevo
        const cartResponse = await cartManager.createCart();
        cartId = cartResponse._id;
      } else {
        // Si el usuario ya existe y tiene un carrito asociado, usa su ID de carrito existente
        cartId = exist.cart._id;
      }
  
      // Asigna el ID del carrito al userData
      userData.cart = cartId;
  
      // Si el usuario es admin, establece su rol
      if (userData.email === "admin@coder.com") {
        userData.role = "admin";
      }
  
      // Agrega el usuario con los datos actualizados, incluido el ID del carrito
      const newUser = await this.userDao.addUser(userData);
  
      return newUser;
    } catch (error) {
      console.error(errorDictionary.ERROR_USER_NOT_CREATED, error);
    }
  }
  
  

  async getUserById(id) {
    try {
      return await this.userDao.getUserById(id);
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async deleteUser(id) {
    try {
      return await this.userDao.deleteUser(id);
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  async loginWithGitHub(profile) {
    try {
      const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : '';
      const exist = await this.findUserByEmail(email);
      
      if (!exist) {
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
      return await this.userDao.findUserByEmail(email);
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  async findUserById(id) {
    try {
      return await this.userDao.findUserByGithubId(id);
    } catch (err) {
      console.error(err);
      return null;
    }
  }
}

module.exports = UserManager