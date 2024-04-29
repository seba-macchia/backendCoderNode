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
const UserDTO = require("../dao/dto/user.Dto");

route.post("/register", register);
route.post("/login", login);
route.get("/login_github", loginGithub);
route.get("/login_github/callback", passport.authenticate("login_github", {
  session: false,
}), loginGithubCallback);
route.post("/logout", logout);
route.get("/current", (req, res) => {
  const data = new UserDTO(req.session.user);
  res.send(data);
});

module.exports =route;