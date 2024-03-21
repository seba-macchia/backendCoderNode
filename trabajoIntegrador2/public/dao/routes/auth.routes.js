const express = require("express");
const { Router } = express;
const passport = require('passport');
const route = new Router();
const UserManager = require("../db/userManager.js");
const userManager = new UserManager();
const bcrypt = require("bcrypt");
const saltRounds = 10;
const { tokenGenerator } = require("../utils/generateToken.js");

route.post("/register", async (req, res) => {
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
  }
});

route.post("/login", async (req, res) => {
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
});

route.get(
  "/login_github",
  passport.authenticate("login_github", {
    session: false,
  })
);

route.get(
  '/login_github/callback',
  passport.authenticate('login_github', { session: false }),
  (req, res) => {
    const { token } = req.user;
    res.cookie("cookieToken", token, { httpOnly: true });
    res.redirect("/api/products");
  }
);

route.get("/logout", (req, res) => {
  res.clearCookie("cookieToken").redirect("/login");
});

route.get("/current", passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user) {
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

module.exports = route;