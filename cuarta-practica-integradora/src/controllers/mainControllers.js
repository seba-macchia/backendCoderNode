const userManager = require("../services/userService");
const { getLogger } = require('../config/logger.config');
const logger = getLogger(process.env.NODE_ENV);

function auth(req, res, next) {
  try {
    let users = userManager.getUsers();
    if (users.some((user) => user.username === req.session.user.username && user.password === req.session.user.password)) {
      logger.info("Autenticación exitosa");
      next();
    } else {
      logger.warning("Intento de acceso no autorizado");
      res.redirect("/");
    }
  } catch (error) {
    logger.error(`Error durante la autenticación: ${error.message}`);
    res.status(500).send("Error interno del servidor");
  }
}

function renderLoginPage(req, res) {
  logger.debug("Renderizando página de inicio de sesión");
  res.render("login");
}

function renderRegisterPage(req, res) {
  logger.debug("Renderizando página de registro");
  res.render("register");
}

function renderProfilePage(req, res) {
  logger.debug("Renderizando página de perfil de usuario");
  res.render("profile");
}

module.exports = {
  auth,
  renderLoginPage,
  renderRegisterPage,
  renderProfilePage,
};
