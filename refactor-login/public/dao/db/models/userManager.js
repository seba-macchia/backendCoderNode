const User = require("./user.model");

class userManager {
  constructor() {
    this.users = [];
  }
  async getUsers() {
    try {
      const users = await User.find();
      return users;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const user = await User.findById(id);
      if (user) {
        return user;
      }
    } catch (error) {
      console.error("Error al obtener usuario por ID:", error);
    }
  }

  async addUser(user) {
    try {
      const newUser = new User(user);
      
      await newUser.save();
    } catch (error) {
      console.error("Error al agregar usuario:", error);
    }
  }
  async updateUser(id, data) {
    try {
      await User.updateOne({ _id: id }, data);
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
    }
  }
  async deleteUser(id) {
    try {
      let userDelete = await this.getUserById(id);
      if (userDelete) {
        await User.deleteOne({ _id: id });
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log("Error en eliminar usuario");
    }
  }
}

module.exports = userManager;
