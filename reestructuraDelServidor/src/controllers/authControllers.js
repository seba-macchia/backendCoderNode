const { passport } = require('../config/passport.config.js');
const bcrypt = require("bcrypt");
const { tokenGenerator } = require("../utils/generateToken.js");
const UserManager = require("../services/userService.js");
const userManager = new UserManager();

const saltRounds = 10;

async function register(req, res) {
  try {
    let userNew = req.body;
    userNew.name = req.body.name;
    userNew.username = req.body.username;

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
    const token = tokenGenerator(user);
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
  res.cookie("cookieToken", token, { httpOnly: true });
  res.redirect("/api/products");
}

function logout(req, res) {
  res.clearCookie("cookieToken").redirect("/login");
}

function getCurrentUser(req, res) {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
}

module.exports = {
  register,
  login,
  loginGithub,
  loginGithubCallback,
  logout,
  getCurrentUser,
};
