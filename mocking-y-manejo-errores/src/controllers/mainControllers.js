const userManager = require("../services/userService");

function auth(req, res, next) {
  let users = userManager.getUsers();
  if (users.some((user) => user.username === req.session.user.username && user.password === req.session.user.password)) {
    next();
  } else {
    res.redirect("/");
  }
}

function renderLoginPage(req, res) {
  res.render("login");
}

function renderRegisterPage(req, res) {
  res.render("register");
}

function renderProfilePage(req, res) {
  res.render("profile");
}

module.exports = {
  auth,
  renderLoginPage,
  renderRegisterPage,
  renderProfilePage,
};
