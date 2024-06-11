const bcrypt = require("bcrypt");
const { tokenGenerator } = require("../utils/generateToken.js");
const UserManager = require("../services/userService.js");
const TicketService = require("../services/ticketService.js");
const errorDictionary = require('../middleware/errorDictionary.js');
const { getLogger } = require('../config/logger.config');
const logger = getLogger(process.env.NODE_ENV);
const {passport} = require('../config/passport.config.js');

const userManager = new UserManager();
const ticketService = new TicketService(); // Crea una instancia del servicio de tickets

const saltRounds = 10;

async function register(req, res) {
  try {
    let userNew = req.body;
    userNew.name = req.body.name;

    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);
    userNew.password = hashedPassword;

    await userManager.addUser(userNew);
    res.redirect("/");

    logger.info('Usuario registrado correctamente');
  } catch (error) {
    logger.error('Error al registrar usuario:', error);
    res.status(500).send(errorDictionary.INTERNAL_SERVER_ERROR);
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userManager.findUserByEmail(email);
    if (!user) {
      logger.warning(`Usuario no encontrado con el correo electrónico proporcionado: ${email}`);
      return res.status(401).send(errorDictionary.EMAIL_ERROR);
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      logger.warning(`Contraseña incorrecta para el usuario: ${email}`);
      return res.status(401).send(errorDictionary.PASSWORD_ERROR);
    }

    // Actualizar last_connection para el usuario
    user.last_connection = new Date();
    await user.save();

    // Verificar si el usuario es el administrador
    if (user.email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
      logger.info(`Inicio de sesión del administrador:${email}`);
      const token = tokenGenerator(user);
      req.session.user = user; // Agregar el usuario a la sesión
      res.cookie("cookieToken", token, { httpOnly: true });
      res.redirect("/admin/dashboard"); // Ejemplo de redirección para el administrador
      return;
    }

    // Si no es el administrador, continuar con la autenticación normal
    const userId = user._id; // Obtener el ID del usuario
    const token = tokenGenerator(user); 
    req.session.user = user; // Agregar el usuario a la sesión
    res.cookie("cookieToken", token, { httpOnly: true });

    // Redirigir a la página de productos y pasar el userId como parámetro
    res.redirect(`/api/products?userId=${userId}`);

    logger.info(`Inicio de sesión exitoso: ${email}`);
  } catch (error) {
    logger.error(`Error al iniciar sesión: ${error}`);
    res.status(500).send(errorDictionary.INTERNAL_SERVER_ERROR);
  }
}



function loginGithub(req, res, next) {
  passport.authenticate("login_github", {
    session: false,
  })(req, res, next);
}

async function loginGithubCallback(req, res) {
  const user = req.user;
  const token = tokenGenerator(user);
  req.session.user = user; // Agregar el usuario a la sesión

  // Verificar si el usuario inicia sesión desde GitHub
  if (user.githubId) {
    // Si es un usuario de GitHub, asignar el rol y el correo electrónico de GitHub
    user.role = "admin"; // Asignar el rol de administrador
    user.email = user.email || `${user.username}@github.com`;
  }

  res.cookie("cookieToken", token, { httpOnly: true });
  res.redirect("/api/products");
}

async function logout(req, res) {
  try {
    const userId = req.session.user._id; // Obtener el ID del usuario de la sesión

    // Obtener la instancia del usuario y actualizar su last_connection
    const user = await userManager.getUserById(userId);
    if (user) {
      user.last_connection = new Date(); // Establecer la última conexión como la fecha y hora actuales
      await user.save();
    }

    req.session.destroy((err) => {
      if (err) {
        logger.error(`Error al destruir la sesión: ${err}`);
        res.status(500).send(errorDictionary.INTERNAL_SERVER_ERROR);
      } else {
        res.clearCookie("cookieToken").redirect("/login");
      }
    });
  } catch (error) {
    logger.error(`Error al cerrar sesión: ${error}`);
    res.status(500).send(errorDictionary.INTERNAL_SERVER_ERROR);
  }
}

// Función para construir el DTO del usuario con la información necesaria
function getCurrentUserDTO(user) {
  // Construir el DTO del usuario con la información necesaria
  const userDTO = {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,

  };
  return userDTO;
}

async function completePurchase(req, res) {
  try {
    // Lógica para completar la compra y generar el ticket
    const ticket = await ticketService.generateTicket(req.session.user, req.body.products);

    // Filtrar los productos que no pudieron comprarse
    const productsNotPurchased = ticketService.getProductsNotPurchased();

    // Actualizar el carrito del usuario con los productos que no pudieron comprarse
    await userManager.updateUserCart(req.session.user, productsNotPurchased);

    res.status(200).json({ message: "Compra completada", ticket: ticket });

    logger.info(`Compra completada por el usuario: ${req.session.user.email}`);
  } catch (error) {
    logger.error('Error al completar la compra:', error);
    res.status(500).send(errorDictionary.INTERNAL_SERVER_ERROR);
  }
}

module.exports = {
  register,
  login,
  loginGithub,
  loginGithubCallback,
  logout,
  getCurrentUserDTO,
  completePurchase, 
};
