const express = require("express");
const { Router } = express;
const passport = require('passport');
const route = new Router();
const {
  register,
  login,
  loginGithub,
  loginGithubCallback,
  logout,
  getCurrentUser,
} = require("../controllers/authControllers");

route.post("/register", register);
route.post("/login", login);
route.get("/login_github", loginGithub);
route.get("/login_github/callback", passport.authenticate("login_github", {
  session: false,
}), loginGithubCallback);
route.get("/logout", logout);
route.get("/current", passport.authenticate('jwt', { session: false }), getCurrentUser);

module.exports = route;
