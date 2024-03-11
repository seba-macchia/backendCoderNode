const express = require('express');
const { Router } = require("express");

const userManager = require("../public/dao/db/models/userManager.js");
const productsRoutes = require("./products.routes"); // Importa las rutas de productos
const cartsRoutes = require("./carts.routes"); // Importa las rutas de carritos
const authRoutes = require("./auth.routes");
const passport = require('../public/dao/config/passport.config.js');

const route = new Router();
// Monta las rutas de productos
route.use("/api/products", productsRoutes);

// Monta las rutas de carritos
route.use("/api/carts", cartsRoutes);

route.use('/', authRoutes);

function auth(req, res, next) {
  let users = userManager.getUsers();
  if (users.some((user) => user.email === req.session.user.email && user.password === req.session.user.password)) {
    next();
  } else {
    res.redirect("/");
  }
}


route.get('/', (req, res) => {
  res.render('login');
})

route.get('/register', (req, res) => {
  res.render('register');
})

route.get('/profile', auth, (req, res) => {

  res.render('profile');
})


// Rutas para la autenticación de GitHub
route.get('/auth/github',
  passport.authenticate('github'));

route.get('/auth/callbackGithub',
  passport.authenticate('github', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/api/products');
  });



module.exports = route