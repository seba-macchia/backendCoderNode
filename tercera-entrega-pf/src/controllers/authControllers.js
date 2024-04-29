const { passport } = require('../config/passport.config.js');
const bcrypt = require("bcrypt");
const { tokenGenerator } = require("../utils/generateToken.js");
const UserManager = require("../services/userService.js");
const TicketService = require("../services/ticketService.js"); // Importa el servicio de tickets
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
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userManager.findUserByEmail(email);
    if (!user) {
      return res.status(401).send("Correo electrónico incorrecto");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).send("Contraseña incorrecta");
    }

    // Verificar si el usuario es el administrador
    if (user.email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
      // Agregar la lógica específica para el administrador aquí
      const token = tokenGenerator(user);
      req.session.user = user; // Agregar el usuario a la sesión
      res.cookie("cookieToken", token, { httpOnly: true });
      return res.redirect("/admin/dashboard"); // Ejemplo de redirección para el administrador
    }

    // Si no es el administrador, continuar con la autenticación normal
    const token = tokenGenerator(user);
    req.session.user = user; // Agregar el usuario a la sesión
    res.cookie("cookieToken", token, { httpOnly: true });
    res.redirect("/api/products");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
  }
}

function loginGithub(req, res, next) {
  passport.authenticate("login_github", {
    session: false,
  })(req, res, next);
}

function loginGithubCallback(req, res) {
  const user = req.user;
  const token = tokenGenerator(user);
  req.session.user = user; // Agregar el usuario a la sesión

  // Verificar si el usuario inicia sesión desde GitHub
  if (user.githubId) {
    // Si es un usuario de GitHub, asignar el rol y el correo electrónico de GitHub
    user.role = "github-user";
    user.email = user.email || `${user.username}@github.com`;
  }

  res.cookie("cookieToken", token, { httpOnly: true });
  res.redirect("/api/products");
}

async function logout(req, res) {
  res.clearCookie("cookieToken").redirect("/login");
}

// Función para construir el DTO del usuario con la información necesaria
function getCurrentUserDTO(user) {
  // Construir el DTO del usuario con la información necesaria
  const userDTO = {
    id: user._id,
    email: user.email,
    name: user.name,
    role: user.role,
    // Agregar más campos si es necesario
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
  } catch (error) {
    console.error(error);
    res.status(500).send("Error interno del servidor");
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
